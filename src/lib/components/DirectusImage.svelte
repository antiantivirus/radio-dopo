<script>
  import { Image } from "@unpic/svelte";
  import { directusTransformer } from "../unpicConfig.js";

  /**
   * DirectusImage - A wrapper around @unpic/svelte's Image component
   * configured to work with Directus CMS images
   */

  let {
    src,
    alt = "",
    width,
    height,
    layout = "constrained",
    cdn = "directus",
    ...restProps
  } = $props();

  // Transform the src to ensure it's a full Directus URL
  const transformedSrc = $derived(directusTransformer(src));
</script>

<Image
  src={transformedSrc}
  {alt}
  {width}
  {height}
  {layout}
  {cdn}
  {...restProps}
/>
