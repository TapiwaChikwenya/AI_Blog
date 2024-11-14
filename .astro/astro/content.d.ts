declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"2024-10-20-ibm-debuts-open-source-granite-30-llms-for-enterprise-ai.mdx": {
	id: "2024-10-20-ibm-debuts-open-source-granite-30-llms-for-enterprise-ai.mdx";
  slug: "2024-10-20-ibm-debuts-open-source-granite-30-llms-for-enterprise-ai";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-20-the-ai-edge-in-cybersecurity-predictive-tools-aim-to-slash-response-times.mdx": {
	id: "2024-10-20-the-ai-edge-in-cybersecurity-predictive-tools-aim-to-slash-response-times.mdx";
  slug: "2024-10-20-the-ai-edge-in-cybersecurity-predictive-tools-aim-to-slash-response-times";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-21-elon-musks-xai-launches-api-letting-third-party-developers-build-atop-grok.mdx": {
	id: "2024-10-21-elon-musks-xai-launches-api-letting-third-party-developers-build-atop-grok.mdx";
  slug: "2024-10-21-elon-musks-xai-launches-api-letting-third-party-developers-build-atop-grok";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-21-gartner-2025-will-see-the-rise-of-ai-agents-and-other-top-trends.mdx": {
	id: "2024-10-21-gartner-2025-will-see-the-rise-of-ai-agents-and-other-top-trends.mdx";
  slug: "2024-10-21-gartner-2025-will-see-the-rise-of-ai-agents-and-other-top-trends";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-21-investing-in-ai-to-build-next-generation-infrastructure.mdx": {
	id: "2024-10-21-investing-in-ai-to-build-next-generation-infrastructure.mdx";
  slug: "2024-10-21-investing-in-ai-to-build-next-generation-infrastructure";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-21-microsofts-new-ai-agents-set-to-shake-up-enterprise-software-sparking-new-battle-with-salesforce.mdx": {
	id: "2024-10-21-microsofts-new-ai-agents-set-to-shake-up-enterprise-software-sparking-new-battle-with-salesforce.mdx";
  slug: "2024-10-21-microsofts-new-ai-agents-set-to-shake-up-enterprise-software-sparking-new-battle-with-salesforce";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-21-qualcomm-unveils-snapdragon-8-elite-as-worlds-fastest-mobile-cpu.mdx": {
	id: "2024-10-21-qualcomm-unveils-snapdragon-8-elite-as-worlds-fastest-mobile-cpu.mdx";
  slug: "2024-10-21-qualcomm-unveils-snapdragon-8-elite-as-worlds-fastest-mobile-cpu";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-22-ai-startup-ideogram-launches-infinite-canvas-for-manipulating-combining-generated-images.mdx": {
	id: "2024-10-22-ai-startup-ideogram-launches-infinite-canvas-for-manipulating-combining-generated-images.mdx";
  slug: "2024-10-22-ai-startup-ideogram-launches-infinite-canvas-for-manipulating-combining-generated-images";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-22-ai-video-startup-genmo-launches-mochi-1-an-open-source-rival-to-runway-kling-and-others.mdx": {
	id: "2024-10-22-ai-video-startup-genmo-launches-mochi-1-an-open-source-rival-to-runway-kling-and-others.mdx";
  slug: "2024-10-22-ai-video-startup-genmo-launches-mochi-1-an-open-source-rival-to-runway-kling-and-others";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-22-anthropics-new-ai-can-use-computers-like-a-human-redefining-automation-for-enterprises.mdx": {
	id: "2024-10-22-anthropics-new-ai-can-use-computers-like-a-human-redefining-automation-for-enterprises.mdx";
  slug: "2024-10-22-anthropics-new-ai-can-use-computers-like-a-human-redefining-automation-for-enterprises";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-22-asana-ai-studio-now-offers-ai-agent-creation-for-workflow-management.mdx": {
	id: "2024-10-22-asana-ai-studio-now-offers-ai-agent-creation-for-workflow-management.mdx";
  slug: "2024-10-22-asana-ai-studio-now-offers-ai-agent-creation-for-workflow-management";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-22-cohere-adds-vision-to-its-rag-search-capabilities.mdx": {
	id: "2024-10-22-cohere-adds-vision-to-its-rag-search-capabilities.mdx";
  slug: "2024-10-22-cohere-adds-vision-to-its-rag-search-capabilities";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-22-crewai-now-lets-you-build-fleets-of-enterprise-ai-agents.mdx": {
	id: "2024-10-22-crewai-now-lets-you-build-fleets-of-enterprise-ai-agents.mdx";
  slug: "2024-10-22-crewai-now-lets-you-build-fleets-of-enterprise-ai-agents";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-22-dotmatics-aims-to-speed-drug-development-break-data-silos-with-geneious-luma.mdx": {
	id: "2024-10-22-dotmatics-aims-to-speed-drug-development-break-data-silos-with-geneious-luma.mdx";
  slug: "2024-10-22-dotmatics-aims-to-speed-drug-development-break-data-silos-with-geneious-luma";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-22-generative-ai-grows-17percent-in-2024-but-data-quality-plummets-key-findings-from-appens-state-of-ai-report.mdx": {
	id: "2024-10-22-generative-ai-grows-17percent-in-2024-but-data-quality-plummets-key-findings-from-appens-state-of-ai-report.mdx";
  slug: "2024-10-22-generative-ai-grows-17percent-in-2024-but-data-quality-plummets-key-findings-from-appens-state-of-ai-report";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-22-netvrk-launches-its-ai-powered-metaverse-with-unreal-engine-5-graphics.mdx": {
	id: "2024-10-22-netvrk-launches-its-ai-powered-metaverse-with-unreal-engine-5-graphics.mdx";
  slug: "2024-10-22-netvrk-launches-its-ai-powered-metaverse-with-unreal-engine-5-graphics";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-22-qualcomm-unveils-snapdragon-elite-platforms-for-automotive.mdx": {
	id: "2024-10-22-qualcomm-unveils-snapdragon-elite-platforms-for-automotive.mdx";
  slug: "2024-10-22-qualcomm-unveils-snapdragon-elite-platforms-for-automotive";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-22-stable-diffusion-35-debuts-as-stability-ai-aims-to-improve-open-models-for-generating-images.mdx": {
	id: "2024-10-22-stable-diffusion-35-debuts-as-stability-ai-aims-to-improve-open-models-for-generating-images.mdx";
  slug: "2024-10-22-stable-diffusion-35-debuts-as-stability-ai-aims-to-improve-open-models-for-generating-images";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-22-this-is-a-game-changer-runway-releases-new-ai-facial-expression-motion-capture-feature-act-one.mdx": {
	id: "2024-10-22-this-is-a-game-changer-runway-releases-new-ai-facial-expression-motion-capture-feature-act-one.mdx";
  slug: "2024-10-22-this-is-a-game-changer-runway-releases-new-ai-facial-expression-motion-capture-feature-act-one";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-22-would-you-trust-ai-to-mediate-an-argument.mdx": {
	id: "2024-10-22-would-you-trust-ai-to-mediate-an-argument.mdx";
  slug: "2024-10-22-would-you-trust-ai-to-mediate-an-argument";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-23-google-deepmind-is-making-its-ai-text-watermark-open-source.mdx": {
	id: "2024-10-23-google-deepmind-is-making-its-ai-text-watermark-open-source.mdx";
  slug: "2024-10-23-google-deepmind-is-making-its-ai-text-watermark-open-source";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-23-introducing-the-ai-hype-index.mdx": {
	id: "2024-10-23-introducing-the-ai-hype-index.mdx";
  slug: "2024-10-23-introducing-the-ai-hype-index";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-23-the-algorithms-around-us.mdx": {
	id: "2024-10-23-the-algorithms-around-us.mdx";
  slug: "2024-10-23-the-algorithms-around-us";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-23-the-global-view-of-gaming-from-a-huge-external-development-firm-or-gilles-langourieux-interview.mdx": {
	id: "2024-10-23-the-global-view-of-gaming-from-a-huge-external-development-firm-or-gilles-langourieux-interview.mdx";
  slug: "2024-10-23-the-global-view-of-gaming-from-a-huge-external-development-firm-or-gilles-langourieux-interview";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-31-chasing-ais-value-in-life-sciences.mdx": {
	id: "2024-10-31-chasing-ais-value-in-life-sciences.mdx";
  slug: "2024-10-31-chasing-ais-value-in-life-sciences";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-31-google-just-gave-its-ai-access-to-search-hours-before-openai-launched-chatgpt-search.mdx": {
	id: "2024-10-31-google-just-gave-its-ai-access-to-search-hours-before-openai-launched-chatgpt-search.mdx";
  slug: "2024-10-31-google-just-gave-its-ai-access-to-search-hours-before-openai-launched-chatgpt-search";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-31-meta-makes-its-mobilellm-open-for-researchers-posting-full-weights.mdx": {
	id: "2024-10-31-meta-makes-its-mobilellm-open-for-researchers-posting-full-weights.mdx";
  slug: "2024-10-31-meta-makes-its-mobilellm-open-for-researchers-posting-full-weights";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-31-microsofts-agentic-ai-tool-omniparser-rockets-up-the-open-source-charts.mdx": {
	id: "2024-10-31-microsofts-agentic-ai-tool-omniparser-rockets-up-the-open-source-charts.mdx";
  slug: "2024-10-31-microsofts-agentic-ai-tool-omniparser-rockets-up-the-open-source-charts";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-31-noma-arrives-to-provide-security-from-data-storage-to-deployment-for-enterprise-ai-solutions.mdx": {
	id: "2024-10-31-noma-arrives-to-provide-security-from-data-storage-to-deployment-for-enterprise-ai-solutions.mdx";
  slug: "2024-10-31-noma-arrives-to-provide-security-from-data-storage-to-deployment-for-enterprise-ai-solutions";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-31-openai-brings-a-new-web-search-tool-to-chatgpt.mdx": {
	id: "2024-10-31-openai-brings-a-new-web-search-tool-to-chatgpt.mdx";
  slug: "2024-10-31-openai-brings-a-new-web-search-tool-to-chatgpt";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-31-openai-turns-chatgpt-into-a-search-engine-aims-directly-at-google.mdx": {
	id: "2024-10-31-openai-turns-chatgpt-into-a-search-engine-aims-directly-at-google.mdx";
  slug: "2024-10-31-openai-turns-chatgpt-into-a-search-engine-aims-directly-at-google";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-31-the-great-ai-masquerade-when-automation-wears-an-agent-costume.mdx": {
	id: "2024-10-31-the-great-ai-masquerade-when-automation-wears-an-agent-costume.mdx";
  slug: "2024-10-31-the-great-ai-masquerade-when-automation-wears-an-agent-costume";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-10-31-this-ai-generated-version-of-minecraft-may-represent-the-future-of-real-time-video-generation.mdx": {
	id: "2024-10-31-this-ai-generated-version-of-minecraft-may-represent-the-future-of-real-time-video-generation.mdx";
  slug: "2024-10-31-this-ai-generated-version-of-minecraft-may-represent-the-future-of-real-time-video-generation";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-11-01-ai-on-your-smartphone-hugging-faces-smollm2-brings-powerful-models-to-the-palm-of-your-hand.mdx": {
	id: "2024-11-01-ai-on-your-smartphone-hugging-faces-smollm2-brings-powerful-models-to-the-palm-of-your-hand.mdx";
  slug: "2024-11-01-ai-on-your-smartphone-hugging-faces-smollm2-brings-powerful-models-to-the-palm-of-your-hand";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-11-01-devrev-raises-dollar1008-million-in-series-a-funding-and-becomes-an-ai-unicorn-at-a-dollar115-billion-valuation.mdx": {
	id: "2024-11-01-devrev-raises-dollar1008-million-in-series-a-funding-and-becomes-an-ai-unicorn-at-a-dollar115-billion-valuation.mdx";
  slug: "2024-11-01-devrev-raises-dollar1008-million-in-series-a-funding-and-becomes-an-ai-unicorn-at-a-dollar115-billion-valuation";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-11-01-how-gaming-can-get-back-to-balanced-growth-or-the-deanbeat.mdx": {
	id: "2024-11-01-how-gaming-can-get-back-to-balanced-growth-or-the-deanbeat.mdx";
  slug: "2024-11-01-how-gaming-can-get-back-to-balanced-growth-or-the-deanbeat";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-11-01-runway-goes-3d-with-new-ai-video-camera-controls-for-gen-3-alpha-turbo.mdx": {
	id: "2024-11-01-runway-goes-3d-with-new-ai-video-camera-controls-for-gen-3-alpha-turbo.mdx";
  slug: "2024-11-01-runway-goes-3d-with-new-ai-video-camera-controls-for-gen-3-alpha-turbo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-11-01-the-shows-not-over-2024-sees-big-boost-to-ai-investment.mdx": {
	id: "2024-11-01-the-shows-not-over-2024-sees-big-boost-to-ai-investment.mdx";
  slug: "2024-11-01-the-shows-not-over-2024-sees-big-boost-to-ai-investment";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-11-02-meta-unveils-ai-tools-to-give-robots-a-human-touch-in-physical-world.mdx": {
	id: "2024-11-02-meta-unveils-ai-tools-to-give-robots-a-human-touch-in-physical-world.mdx";
  slug: "2024-11-02-meta-unveils-ai-tools-to-give-robots-a-human-touch-in-physical-world";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-11-02-why-multi-agent-ai-tackles-complexities-llms-cant.mdx": {
	id: "2024-11-02-why-multi-agent-ai-tackles-complexities-llms-cant.mdx";
  slug: "2024-11-02-why-multi-agent-ai-tackles-complexities-llms-cant";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-11-03-enter-the-whisperverse-how-ai-voice-agents-will-guide-us-through-our-days.mdx": {
	id: "2024-11-03-enter-the-whisperverse-how-ai-voice-agents-will-guide-us-through-our-days.mdx";
  slug: "2024-11-03-enter-the-whisperverse-how-ai-voice-agents-will-guide-us-through-our-days";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-11-04-nvidia-ai-blueprint-makes-it-easy-for-any-devs-to-build-automated-agents-that-analyze-video.mdx": {
	id: "2024-11-04-nvidia-ai-blueprint-makes-it-easy-for-any-devs-to-build-automated-agents-that-analyze-video.mdx";
  slug: "2024-11-04-nvidia-ai-blueprint-makes-it-easy-for-any-devs-to-build-automated-agents-that-analyze-video";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-11-04-uc-san-diego-tsinghua-university-researchers-just-made-ai-way-better-at-knowing-when-to-ask-for-help.mdx": {
	id: "2024-11-04-uc-san-diego-tsinghua-university-researchers-just-made-ai-way-better-at-knowing-when-to-ask-for-help.mdx";
  slug: "2024-11-04-uc-san-diego-tsinghua-university-researchers-just-made-ai-way-better-at-knowing-when-to-ask-for-help";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2024-11-04-xai-woos-developers-with-dollar25month-worth-of-api-credits-support-for-openai-anthropic-sdks.mdx": {
	id: "2024-11-04-xai-woos-developers-with-dollar25month-worth-of-api-credits-support-for-openai-anthropic-sdks.mdx";
  slug: "2024-11-04-xai-woos-developers-with-dollar25month-worth-of-api-credits-support-for-openai-anthropic-sdks";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
