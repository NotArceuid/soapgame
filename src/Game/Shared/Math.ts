import { Decimal } from "./BreakInfinity/Decimal.svelte";

export abstract class EquationBase implements IEquation {
  abstract Integrate(lower: number, upper: number): Decimal;
  /*
  * @param input: The input value e.g Player.Money
  * @param level: The level, e.g Upgrade Level 
  * */
  public BuyMax(input: Decimal, level: number): number {
    const fx = (x: number): Decimal => {
      if (x <= 0) return new Decimal(0);
      return this.Integrate(level, level + x);
    };

    if (fx(1).gt(input)) {
      return 1;
    }

    let bound = 1;
    while (fx(bound).lte(input)) {
      bound *= 2;
    }

    return this.BinarySearch(Math.floor(bound / 2), bound, input, fx);
  }

  public BinarySearch(low: number, high: number, input: Decimal, costFunction: (x: number) => Decimal): number {
    let left = low;
    let right = high;
    let result = -1; while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const cost = costFunction(mid);

      if (cost.lte(input)) {
        result = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }
}

export function RiemannSum(a: number, b: number, fx: (i: number) => Decimal, N = 100): Decimal {
  let dx = (b - a) / (N);
  let sum = Decimal.ZERO;

  for (let i = 0; i < N; i++) {
    const x = a + (i + 0.5) * dx
    sum = sum.add(fx(x).mul(dx));
  }

  return sum;
}

// formula: ax * b^x 
export class ExpPolynomial extends EquationBase {
  public a: Decimal;
  public b: Decimal;

  constructor(a: Decimal, b: Decimal) {
    super();

    this.a = a;
    this.b = b;
  }

  public Integrate(lower: number, upper: number): Decimal {

    const lnB = this.b.ln(); // ln(b)
    const invLnB = lnB ** -1; // 1/ln(b)

    const F = (x: number): Decimal => {
      const bPowX = this.b.pow(x); // b^x
      return this.a.mul(bPowX).div(lnB).mul(x - invLnB);
    };

    return F(upper).sub(F(lower));
  }
}

// formula: ab^x
export class Exponential extends EquationBase {
  public a: Decimal;
  public b: Decimal;
  constructor(a: Decimal, b: Decimal) {
    super();

    this.a = a;
    this.b = b;
  }

  Integrate(lower: number, upper: number): Decimal {
    const f = (x: number): Decimal => {
      const lnB = Decimal.ln(this.b);
      return this.a.mul(this.b.pow(x)).div(lnB);
    };

    return f(upper).minus(f(lower));
  }
}

export interface IEquation {
  BinarySearch(low: number, high: number, input: Decimal, costFunction: (x: number) => Decimal): number
  BuyMax(input: Decimal, level: number, a: number, b: number): number
  Integrate(lower: number, upper: number): Decimal;
}

export interface Vector2 {
  x: number;
  y: number;
}

export function affordGeometricSeries(
  resourcesAvailable: Decimal,
  priceStart: Decimal,
  priceRatio: Decimal,
  currentOwned: number | Decimal,
): Decimal {
  const actualStart = priceStart.mul(priceRatio.pow(currentOwned));

  return Decimal.floor(
    resourcesAvailable.div(actualStart).mul(priceRatio.sub(1)).add(1).log10() /
    priceRatio.log10(),
  );
}

export function CountGeometricSeries(
  numItems: number | Decimal,
  priceStart: Decimal,
  priceRatio: Decimal,
  currentOwned: number | Decimal,
): Decimal {
  return priceStart
    .mul(priceRatio.pow(currentOwned))
    .mul(Decimal.sub(1, priceRatio.pow(numItems)))
    .div(Decimal.sub(1, priceRatio));
}

export function affordArithmeticSeries(
  resourcesAvailable: Decimal,
  priceStart: Decimal,
  priceAdd: Decimal,
  currentOwned: Decimal,
): Decimal {
  // n = (-(a-d/2) + sqrt((a-d/2)^2+2dS))/d
  // where a is actualStart, d is priceAdd and S is resourcesAvailable
  // then floor it and you're done!

  const actualStart = priceStart.add(currentOwned.mul(priceAdd));
  const b = actualStart.sub(priceAdd.div(2));
  const b2 = b.pow(2);

  return b
    .neg()
    .add(b2.add(priceAdd.mul(resourcesAvailable).mul(2)).sqrt())
    .div(priceAdd)
    .floor();
}

export function CountArithmeticSeries(
  numItems: Decimal,
  priceStart: Decimal,
  priceAdd: Decimal,
  currentOwned: Decimal,
): Decimal {
  const actualStart = priceStart.add(currentOwned.mul(priceAdd));

  // (n/2)*(2*a+(n-1)*d)
  return numItems
    .div(2)
    .mul(actualStart.mul(2).plus(numItems.sub(1).mul(priceAdd)));
}

export function efficiencyOfPurchase(
  cost: Decimal,
  currentRpS: Decimal,
  deltaRpS: Decimal,
): Decimal {
  return cost.div(currentRpS).add(cost.div(deltaRpS));
}

export function cmp(left: Decimal, right: Decimal): number {
  // TODO: sign(a-b) might be better? https://github.com/Patashu/break_infinity.js/issues/12
  if (left.m === 0) {
    if (right.m === 0) {
      return 0;
    }
    if (right.m < 0) {
      return 1;
    }
    if (right.m > 0) {
      return -1;
    }
  }

  if (right.m === 0) {
    if (left.m < 0) {
      return -1;
    }
    if (left.m > 0) {
      return 1;
    }
  }

  if (left.m > 0) {
    if (right.m < 0) {
      return 1;
    }
    if (left.e > right.e) {
      return 1;
    }
    if (left.e < right.e) {
      return -1;
    }
    if (left.m > right.m) {
      return 1;
    }
    if (left.m < right.m) {
      return -1;
    }
    return 0;
  }

  if (left.m < 0) {
    if (right.m > 0) {
      return -1;
    }
    if (left.e > right.e) {
      return -1;
    }
    if (left.e < right.e) {
      return 1;
    }
    if (left.m > right.m) {
      return 1;
    }
    if (left.m < right.m) {
      return -1;
    }
    return 0;
  }

  throw Error("Unreachable code");
}

export function Clamp(value: number, min: number, max: number) {
  if (value >= max) {
    return max
  }
  else if (value <= min) {
    return min
  }

  return value;
}
