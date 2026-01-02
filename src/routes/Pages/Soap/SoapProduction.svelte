<script>
	import { SoapType } from "../../../Game/Content/Soap.svelte.ts";
	import SoapProducer from "./SoapProducer.svelte";
</script>

<div class="absolute p-2">
	<div class="flex flex-wrap w-full">
		<SoapProducer type={SoapType.Red} />
	</div>
</div>
