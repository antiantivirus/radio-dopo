<script>
  import { enhance } from "$app/forms";
  import { format } from "date-fns";

  export let data;
  export let form;

  let submitting = false;
  let success = false;
  let imageFile = null;
  let imagePreview = "";
  let isDragging = false;

  $: episode = data.episode;
  $: episodeDate = episode?.start
    ? format(new Date(episode.start), "MMMM d, yyyy")
    : "";

  // Get translations for pre-filling
  $: enTranslation =
    episode?.translations?.find((t) => t.languages_code === "en-US") || {};
  $: itTranslation =
    episode?.translations?.find((t) => t.languages_code === "it-IT") || {};

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  }

  function setImageFile(file) {
    imageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    isDragging = false;
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }
</script>

<svelte:head>
  <title>Submit Episode Info - Radio Dopo</title>
</svelte:head>

<div class="min-h-screen p-4 md:p-8">
  <div class="max-w-3xl mx-auto">
    <h1 class="mb-8 text-pink">Submit Episode Info</h1>

    {#if episode}
      <div class="mb-8 p-6 bg-pink/10 border-2 border-pink rounded">
        <div class="flex items-start gap-4">
          <!-- Info Icon -->
          <div class="flex-shrink-0">
            <svg
              class="w-8 h-8 text-pink"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Info Text -->
          <div class="flex-1">
            <h2 class="text-pink text-2xl mb-2 uppercase letter-spacing-wide">
              Submitting for {episode.show_id?.name || "Your Show"}
            </h2>
            <p class="text-xl">
              <strong>Episode Date:</strong>
              {episodeDate},{" "}
              {#if episode.start}
                {format(new Date(episode.start), "HH:mm")} - {episode.end
                  ? format(new Date(episode.end), "HH:mm")
                  : ""}
              {/if}
            </p>
          </div>
        </div>
      </div>

      {#if success || form?.success}
        <div class="p-6 mb-8 bg-blue/20 border border-blue rounded">
          <h3 class="mb-2">Success!</h3>
          <p>
            Your episode information has been updated successfully. Thank you!
          </p>
        </div>
      {:else}
        <form
          method="POST"
          action="?/submit"
          enctype="multipart/form-data"
          use:enhance={() => {
            submitting = true;
            return async ({ result, update }) => {
              submitting = false;
              if (result.type === "success") {
                success = true;
              }
              await update();
            };
          }}
        >
          <div class="space-y-6">
            <!-- Title Field -->
            <div>
              <label
                for="title"
                class="block mb-2 text-lg uppercase letter-spacing-wide"
              >
                Episode Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form?.title || episode.title || ""}
                required
                class="w-full"
                placeholder="Enter episode title"
              />
            </div>

            <!-- Image Field with Drag & Drop -->
            <div>
              <label class="block mb-2 text-lg uppercase letter-spacing-wide">
                Episode Image *
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                required
                on:change={handleFileChange}
                class="hidden"
              />
              <div
                class="border-2 border-dashed rounded p-6 text-center cursor-pointer transition-colors {isDragging
                  ? 'border-orange bg-orange/10'
                  : 'border-white/30 hover:border-white/50'}"
                on:click={() => document.getElementById("image").click()}
                on:drop={handleDrop}
                on:dragover={handleDragOver}
                on:dragleave={handleDragLeave}
                role="button"
                tabindex="0"
              >
                {#if imagePreview}
                  <div class="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      class="max-h-64 mx-auto rounded"
                    />
                    <p class="text-sm opacity-70">
                      {imageFile?.name || "Image selected"} - Click or drop to change
                    </p>
                  </div>
                {:else}
                  <div class="py-8 space-y-2">
                    <svg
                      class="w-16 h-16 mx-auto opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p class="text-lg">Drag and drop an image here</p>
                    <p class="text-sm opacity-70">or click to browse</p>
                  </div>
                {/if}
              </div>
            </div>

            <!-- Description Fields - Italian & English Stacked -->
            <div class="space-y-6">
              <!-- Italian Description -->
              <div>
                <label
                  for="description_it"
                  class="block mb-2 text-lg uppercase letter-spacing-wide"
                >
                  Description (IT) *
                </label>
                <textarea
                  id="description_it"
                  name="description_it"
                  rows="8"
                  required
                  class="w-full bg-transparent border border-white p-4 text-white resize-vertical"
                  placeholder="Inserisci la descrizione dell'episodio in italiano"
                  style="font-size: 1.25rem; line-height: 1.6;"
                  >{form?.description_it ||
                    itTranslation.description ||
                    ""}</textarea
                >
              </div>

              <!-- English Description -->
              <div>
                <label
                  for="description_en"
                  class="block mb-2 text-lg uppercase letter-spacing-wide"
                >
                  Description (EN) *
                </label>
                <textarea
                  id="description_en"
                  name="description_en"
                  rows="8"
                  required
                  class="w-full bg-transparent border border-white p-4 text-white resize-vertical"
                  placeholder="Enter episode description in English"
                  style="font-size: 1.25rem; line-height: 1.6;"
                  >{form?.description_en ||
                    enTranslation.description ||
                    ""}</textarea
                >
              </div>
            </div>

            <!-- Error Message -->
            {#if form?.error}
              <div class="p-4 bg-red/20 border border-red rounded">
                <p class="text-red">{form.error}</p>
              </div>
            {/if}

            <!-- Submit Button -->
            <div class="pt-4">
              <button
                type="submit"
                disabled={submitting}
                class="px-8 py-4 bg-orange text-white rounded no-underline text-lg uppercase letter-spacing-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Episode Info"}
              </button>
            </div>
          </div>
        </form>
      {/if}
    {/if}
  </div>
</div>

<style>
  textarea {
    font-family: inherit;
    outline: none;
  }

  textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  @media screen and (min-width: 768px) {
    textarea {
      font-size: 1.5rem;
    }
  }
</style>
