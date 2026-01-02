import { Decimal } from "./BreakInfinity/Decimal.svelte";

export function RiemannSum(a: number, b: number, fx: (i: number) => Decimal, N = 100): Decimal {
  let dx = (b - a) / (N);
  let sum = Decimal.ZERO;

  for (let i = 0; i < N; i++) {
    const x = a + (i + 0.5) * dx
    sum = sum.add(fx(x).mul(dx));
  }

  return sum;
}

export class ExpPolynomial {
  public a: Decimal;
  public b: Decimal;

  constructor(a: Decimal, b: Decimal) {
    this.a = a;
    this.b = b;
  }

  public Integrate(lower: number, upper: number): Decimal {
    const Mlower = new Decimal(lower);
    const Nupper = new Decimal(upper);

    const lnB = this.b.ln(); // ln(b)
    const invLnB = lnB ** -1; // 1/ln(b)

    const F = (x: Decimal): Decimal => {
      const bPowX = this.b.pow(x); // b^x
      return this.a.mul(bPowX).div(lnB).mul(x.sub(invLnB));
    };

    return F(Nupper).sub(F(Mlower));
  }

  public BuyMax(input: Decimal, level: number): number {
    const fx = (x: number): Decimal => {
      if (x <= 0) return new Decimal(0);
      return this.Integrate(level, level + x);
    };

    if (fx(1).gt(input)) {
      return -1;
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

export interface IEquation {
  BinarySearch(low: number, high: number, input: Decimal, costFunction: (x: number) => Decimal): number
  BuyMax(input: Decimal, level: number, a: number, b: number): number
  Integrate(a: number, b: number, m: number, n: number): Decimal;
}
