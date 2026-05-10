import {
  Image, Camera, LayoutGrid, Wand2, ArrowUpCircle, Scissors,
  Maximize2, Shirt, User, Smile, Layers, Box, Sun, Package,
  Video, Activity, Edit, SkipForward, Palette, UserX,
  Volume2, Film, Mic, Music, Headphones, Subtitles,
  ShoppingBag, Link, Monitor, Copy, Play,
  Cpu, Sparkles, Crown, BarChart, Globe,
  GitMerge, LayoutTemplate, Share2, Calendar,
  Bot, Server, Terminal, Code,
  Grid, Flame, Star, BadgeCheck, Hash, Folder, HardDrive, Download,
  Clock, TrendingUp, Bookmark, FileText, LayoutDashboard, Search,
  UserCircle, UserPlus, Users, Map, Zap,
  PlusCircle, Save, Bell, List, Cloud, Plus,
  Home, Settings, Mic2, HelpCircle,
} from 'lucide-react'

export const TOP_NAV = [
  {
    label: 'Image Studio',
    features: [
      { icon: Image,         name: 'Create Image',       description: 'Generate stunning AI images from any text prompt',          href: '/studio/image/text-to-image' },
      { icon: Camera,        name: 'Cinematic Cameras',  description: 'Image generation with pro camera controls and depth of field', href: '/studio/image/camera-angle',        badge: 'TOP' },
      { icon: LayoutGrid,    name: 'Multi-View',         description: 'Generate 9 different camera angles from one single image',    href: '/studio/image/multi-view',          badge: 'NEW' },
      { icon: Wand2,         name: 'Inpaint & Edit',     description: 'Brush to edit any region of your image using AI',            href: '/studio/image/inpaint' },
      { icon: Maximize2,     name: 'Outpaint / Expand',  description: 'Expand image borders in any direction seamlessly with AI',    href: '/studio/image/outpaint' },
      { icon: ArrowUpCircle, name: 'Upscale Image',      description: 'Enhance resolution to 2x, 4x, or 8x crystal clarity',        href: '/studio/image/upscale' },
      { icon: Scissors,      name: 'Remove Background',  description: 'Clean, instant AI background removal in one click',           href: '/studio/image/remove-bg' },
      { icon: Shirt,         name: 'Fashion Generator',  description: 'Place any outfit on a model in any style instantly',          href: '/studio/image/fashion',             badge: 'NEW' },
      { icon: User,          name: 'AI Headshot',        description: 'Professional studio-quality headshots generated in seconds',  href: '/studio/image/headshot' },
      { icon: Smile,         name: 'Meme Generator',     description: 'Create viral AI memes from a simple text prompt',             href: '/studio/image/meme' },
      { icon: Layers,        name: 'Style Transfer',     description: 'Apply the style of any artwork to your own images',           href: '/studio/image/style-transfer' },
      { icon: Box,           name: 'Image to 3D',        description: 'Convert any flat image into a 3D model or render',            href: '/studio/image/image-to-3d',         badge: 'NEW' },
      { icon: Sun,           name: 'Relight',            description: 'Adjust lighting position, color, and brightness on photos',   href: '/studio/image/relight' },
      { icon: Package,       name: 'Product Placement',  description: 'Place your product into any scene or environment',            href: '/studio/image/product-placement' },
    ],
    models: [
      { icon: Image,     name: 'GPT Image 2',       description: '4K images with near-perfect text rendering by OpenAI',     href: '/studio/image/text-to-image',     badge: 'NEW' },
      { icon: Zap,       name: 'Nano Banana 2',     description: 'Pro quality image generation at blazing Flash speed' },
      { icon: Crown,     name: 'Nano Banana Pro',   description: 'The best 4K image model ever built for creators',           badge: 'TOP' },
      { icon: Sparkles,  name: 'Seedream 5.0',      description: 'ByteDance intelligent visual reasoning and quality' },
      { icon: Layers,    name: 'Flux Kontext',      description: 'Reference-faithful image editing and style transfer' },
      { icon: Star,      name: 'Midjourney v7',     description: 'Artistic quality benchmark — best-looking AI outputs',      badge: 'TOP' },
      { icon: Cpu,       name: 'Ideogram v3',       description: 'Best model for accurate text-in-image rendering' },
      { icon: Camera,    name: 'GPT Image 1.5',     description: 'True-color precision rendering for product shots' },
      { icon: Globe,     name: 'Grok Imagine',      description: 'xAI image generation — fast and creative outputs' },
      { icon: Grid,      name: 'SDXL',              description: 'Classic open-source powerhouse for any style' },
    ],
  },

  {
    label: 'Video Studio',
    features: [
      { icon: Video,            name: 'Text to Video',       description: 'Generate high-quality video clips from any text prompt',     href: '/studio/video/text-to-video' },
      { icon: Image,            name: 'Image to Video',      description: 'Animate any still image into a smooth, cinematic video',      href: '/studio/video/image-to-video' },
      { icon: Film,             name: 'Smart Shot',          description: 'Prompt → storyboard plan → full cinematic video automatically', href: '/studio/video/smart-shot',        badge: 'NEW' },
      { icon: Activity,         name: 'Motion Sync',         description: 'Sync motion patterns from a reference video to your subject',  href: '/studio/video/motion-sync' },
      { icon: Edit,             name: 'Edit Video',          description: 'Inpaint and redo specific regions of any video with AI',       href: '/studio/video/edit' },
      { icon: SkipForward,      name: 'Extend Video',        description: 'Seamlessly add more seconds to the end of any video',          href: '/studio/video/extend' },
      { icon: Palette,          name: 'Restyle Video',       description: 'Apply a completely new visual style to any existing video',    href: '/studio/video/restyle' },
      { icon: UserX,            name: 'Replace Character',   description: 'Swap out and replace characters inside any video clip',        href: '/studio/video/replace-character',  badge: 'NEW' },
      { icon: ArrowUpCircle,    name: 'Video Upscale',       description: 'Enhance any video to HD or 4K resolution with AI',             href: '/studio/video/upscale' },
      { icon: Volume2,          name: 'Add Sound Effects',   description: 'Layer AI-generated sound effects onto any video automatically', href: '/studio/video/sound-effects' },
      { icon: Layers,           name: 'Mixed Media',         description: 'Blend real footage with AI-generated visuals seamlessly',      href: '/studio/video/mixed-media' },
      { icon: Camera,           name: 'Camera Motion',       description: 'Apply zoom, pan, orbit, and dolly presets to your video',      href: '/studio/video/camera-motion' },
    ],
    models: [
      { icon: Crown,     name: 'Seedance 2.0',       description: 'ByteDance flagship — best quality video generation',     badge: 'TOP' },
      { icon: Sparkles,  name: 'Kling 3.0',          description: 'Industry-leading motion quality and realism',            badge: 'TOP' },
      { icon: Cpu,       name: 'Sora 2',             description: "OpenAI's cinematic video model for any creative scene",  badge: 'NEW' },
      { icon: Globe,     name: 'Veo 3.1',            description: "Google's highest quality AI video generation model",     badge: 'NEW' },
      { icon: Zap,       name: 'WAN 2.6',            description: 'Fast open-source video generation with great quality' },
      { icon: Film,      name: 'MiniMax Hailuo 02',  description: 'Full HD multi-aspect video with fast generation' },
      { icon: Activity,  name: 'Runway Gen-3',       description: 'Creative film-quality model for professional output' },
      { icon: Layers,    name: 'Hunyuan Video',      description: 'Tencent cinematic video model — high visual quality' },
      { icon: Star,      name: 'Grok T2V',           description: 'xAI video generation — fun, normal, and spicy modes',   badge: 'NEW' },
      { icon: Image,     name: 'Midjourney I2V',     description: 'Animate your Midjourney images into stunning video' },
    ],
  },

  {
    label: 'Lip Sync',
    features: [
      { icon: User,         name: 'Portrait + Audio',     description: 'Animate any portrait photo with any audio file instantly',        href: '/studio/lipsync/portrait' },
      { icon: Video,        name: 'Video + Audio',        description: 'Sync lips perfectly on any existing video with new audio',         href: '/studio/lipsync/video' },
      { icon: Users,        name: 'Bulk Lip Sync',        description: 'One character combined with 100 audio files = 100 videos',         href: '/studio/lipsync/bulk',     badge: 'NEW' },
      { icon: UserCircle,   name: 'Talking Avatar',       description: 'Build and save a persistent reusable talking avatar',              href: '/studio/lipsync/avatar' },
      { icon: Globe,        name: 'Multi-language Dub',   description: 'Dub any video into any language with AI voice sync',               href: '/studio/lipsync/dubbing',  badge: 'NEW' },
    ],
    models: [
      { icon: Zap,       name: 'Infinite Talk',      description: 'Portrait image to realistic talking video — fastest model', badge: 'TOP' },
      { icon: Cpu,       name: 'LTX 2.3 Lipsync',   description: 'HD lipsync generation up to 1080p resolution' },
      { icon: Film,      name: 'LTX 2 19B',         description: 'Largest LTX model — highest quality lip sync' },
      { icon: Activity,  name: 'Wan 2.2 Speech',     description: 'Speech-driven video generation from portrait' },
      { icon: Layers,    name: 'Sync Lipsync',       description: 'Frame-perfect audio-to-lip synchronization engine' },
      { icon: Settings,  name: 'LatentSync',         description: 'Open-source lipsync model with strong accuracy' },
      { icon: Star,      name: 'Veed Lipsync',       description: 'Studio-quality lip sync used by professionals' },
      { icon: Sparkles,  name: 'Creatify Lipsync',   description: 'Built-in platform lip sync — fast and reliable' },
    ],
  },

  {
    label: 'Audio Studio',
    features: [
      { icon: Mic,        name: 'Text to Voiceover',   description: 'Generate natural voiceovers from text in 100+ voices and languages',  href: '/studio/audio/voiceover' },
      { icon: Activity,   name: 'Voice Cloning',       description: 'Clone any voice from a 10-second audio sample and reuse it forever',  href: '/studio/audio/voice-clone',  badge: 'NEW' },
      { icon: Music,      name: 'Text to Music',       description: 'Generate full music tracks by genre, mood, and BPM with AI',          href: '/studio/audio/music' },
      { icon: Volume2,    name: 'Sound Effects',       description: 'Create any sound effect from a simple text description',               href: '/studio/audio/sfx' },
      { icon: Subtitles,  name: 'Audio to Subtitles',  description: 'Auto-transcribe any audio or video to accurate subtitle text',        href: '/studio/audio/subtitles' },
      { icon: Headphones, name: 'ASMR Generator',      description: 'Generate soothing, high-quality ASMR audio with AI',                 href: '/studio/audio/asmr',         badge: 'NEW' },
      { icon: Film,       name: 'Background Music',    description: 'Auto-score background music perfectly matched to your video',         href: '/studio/audio/background-music' },
    ],
    models: [
      { icon: Crown,     name: 'ElevenLabs',   description: 'The gold standard for natural text-to-speech voice quality', badge: 'TOP' },
      { icon: Sparkles,  name: 'OpenAI TTS',   description: 'Smooth and natural voice synthesis from OpenAI' },
      { icon: Music,     name: 'Suno',         description: 'AI music generation — full songs in any genre',              badge: 'NEW' },
      { icon: Mic2,      name: 'Udio',         description: 'Full AI music track creation with lyrics and style' },
      { icon: Zap,       name: 'Muapi Voice',  description: 'Fast multilingual TTS powered by Muapi.ai' },
    ],
  },

  {
    label: 'Cinema Studio',
    features: [
      { icon: Film,           name: 'Cinematic Generator',   description: 'Full cinematic video generation with Hollywood-level quality',   href: '/studio/cinema/generate' },
      { icon: Sparkles,       name: 'VFX Presets',           description: '200+ one-click visual effects — explosion, fire, raven and more', href: '/studio/cinema/vfx',        badge: 'NEW' },
      { icon: Palette,        name: 'Color Grading',         description: 'Apply professional color grading presets to any video instantly', href: '/studio/cinema/color-grading' },
      { icon: LayoutTemplate, name: 'Storyboard Builder',    description: 'Plan and visualize your scenes before generating any video',      href: '/studio/cinema/storyboard' },
      { icon: Layers,         name: 'Scene Composition',     description: 'Director-level control over every element in your scene',         href: '/studio/cinema/scene' },
      { icon: Film,           name: 'Genre Presets',         description: 'One-click style presets for action, horror, romance, sci-fi',     href: '/studio/cinema/genres' },
      { icon: Camera,         name: 'Camera Controls',       description: 'Lens, focal length, aperture, and depth of field controls',       href: '/studio/cinema/camera',     badge: 'TOP' },
    ],
    models: [
      { icon: Crown,     name: 'Kling 3.0 Cinema',  description: 'Best cinematic motion quality available today',           badge: 'TOP' },
      { icon: Sparkles,  name: 'Sora 2',            description: "OpenAI's model built for cinematic storytelling",          badge: 'NEW' },
      { icon: Globe,     name: 'Veo 3.1',           description: "Google's film-grade video generation model",               badge: 'NEW' },
      { icon: Film,      name: 'Seedance Pro',      description: 'Professional cinematic video generation by ByteDance' },
      { icon: Activity,  name: 'Runway Gen-3',      description: 'Hollywood-grade output for creative professionals' },
    ],
  },

  {
    label: 'Marketing Studio',
    features: [
      { icon: ShoppingBag, name: 'UGC Ad Generator',    description: 'Create scroll-stopping UGC-style video ads that convert',       href: '/studio/marketing/ugc',       badge: 'TOP' },
      { icon: Link,        name: 'Product URL to Ad',   description: 'Paste any product URL and get auto-generated video ads',        href: '/studio/marketing/product-url', badge: 'NEW' },
      { icon: Palette,     name: 'Brand Kit',           description: 'Upload logo, colors, and fonts once — applied to all outputs',  href: '/studio/marketing/brand-kit' },
      { icon: Monitor,     name: 'Platform Formatter',  description: 'Auto-resize content to 9:16, 1:1, 16:9, and 4:5 formats',      href: '/studio/marketing/formatter' },
      { icon: Zap,         name: 'Hook Generator',      description: 'Generate 20 proven viral opening hooks for any niche or product', href: '/studio/marketing/hooks' },
      { icon: Copy,        name: 'Batch Ad Generator',  description: 'Create 10 different ad variants from one product in one click',  href: '/studio/marketing/batch',     badge: 'NEW' },
      { icon: Play,        name: 'Story Ad Builder',    description: 'Build high-converting short-form story ads for any platform',   href: '/studio/marketing/stories' },
      { icon: Package,     name: 'Product Demo',        description: 'Showcase your product in motion with stunning AI video demos',  href: '/studio/marketing/demo' },
    ],
    models: [
      { icon: Crown,     name: 'Kling 3.0',      description: 'Best motion quality model for ad video generation',      badge: 'TOP' },
      { icon: Sparkles,  name: 'Seedance 2.0',   description: 'Fast, high quality generation perfect for ad content' },
      { icon: Cpu,       name: 'GPT Image 2',    description: 'Stunning 4K product images with perfect text overlay' },
      { icon: Activity,  name: 'Runway Gen-3',   description: 'Cinematic product video for premium brand content' },
      { icon: Crown,     name: 'Nano Banana Pro', description: 'Ultra-fast 4K product images for rapid iteration',     badge: 'TOP' },
    ],
  },
]

export const SIDEBAR_ITEMS = [
  { icon: Home,         label: 'Home',      href: '/studio/home',     flyout: null },

  {
    icon: Copy, label: 'Bulk', href: '/studio/bulk',
    flyout: {
      title: 'Bulk Generate',
      leftLabel: 'Generate', rightLabel: 'Manage',
      left: [
        { icon: Image,   name: 'Bulk Image',     description: 'Upload a CSV and generate up to 500 images at once',          href: '/studio/bulk/image' },
        { icon: Video,   name: 'Bulk Video',     description: 'Upload a CSV and generate up to 500 videos in one batch',     href: '/studio/bulk/video' },
        { icon: Mic2,    name: 'Bulk Lip Sync',  description: 'One character plus 100 audio files equals 100 videos',        href: '/studio/bulk/lipsync',  badge: 'NEW' },
        { icon: Mic,     name: 'Bulk Voiceover', description: 'CSV of scripts instantly converted to batch audio files',     href: '/studio/bulk/voiceover' },
      ],
      right: [
        { icon: List,     name: 'Job Queue',      description: 'Live progress tracker showing status of every running job',  href: '/studio/bulk/queue' },
        { icon: Download, name: 'Download ZIP',   description: 'Export all completed batch outputs as a single ZIP file',    href: '/studio/bulk/download' },
        { icon: Bell,     name: 'Webhooks',       description: 'Get notified automatically when any batch completes',        href: '/studio/bulk/webhooks',  badge: 'NEW' },
        { icon: Cloud,    name: 'Push to Drive',  description: 'Auto-send all outputs directly to your Google Drive folder', href: '/studio/bulk/drive' },
      ],
    },
  },

  {
    icon: TrendingUp, label: 'Ideas', href: '/studio/ideas',
    flyout: {
      title: 'Content Ideas & Trends',
      leftLabel: 'Discover', rightLabel: 'Create',
      left: [
        { icon: TrendingUp,  name: 'Trending Now',       description: 'Top 20 viral trends refreshed and updated every 24 hours',       href: '/studio/ideas/trending',    badge: 'TOP' },
        { icon: Globe,       name: 'By Region',          description: 'Filter trending topics by any country or worldwide',              href: '/studio/ideas/region' },
        { icon: Hash,        name: 'By Platform',        description: 'TikTok, Instagram, YouTube, LinkedIn trends by platform',         href: '/studio/ideas/platform' },
        { icon: Bookmark,    name: 'Saved Ideas',        description: 'All your bookmarked content ideas saved in one place',            href: '/studio/ideas/saved' },
        { icon: Calendar,    name: 'Content Calendar',   description: 'Plan and schedule your content creation pipeline',                href: '/studio/ideas/calendar' },
      ],
      right: [
        { icon: FileText,         name: 'Script Generator',    description: 'AI writes a complete video script from any content idea',         href: '/studio/ideas/scripts',    badge: 'NEW' },
        { icon: LayoutDashboard,  name: 'Storyboard Pipeline', description: 'Script to storyboard to bulk video generation in one click',      href: '/studio/ideas/storyboard', badge: 'NEW' },
        { icon: Zap,              name: 'Hook Generator',      description: 'Generate 20 proven viral opening hooks for your niche',           href: '/studio/ideas/hooks' },
        { icon: Search,           name: 'Competitor Analyzer', description: 'Reverse-engineer what makes top-performing content work',         href: '/studio/ideas/competitor' },
        { icon: Camera,           name: 'Thumbnail Generator', description: 'Generate 5 AI thumbnail variants for any content idea',           href: '/studio/ideas/thumbnails' },
      ],
    },
  },

  {
    icon: UserCircle, label: 'Characters', href: '/studio/characters',
    flyout: {
      title: 'Characters & Worlds',
      leftLabel: 'Characters', rightLabel: 'Worlds',
      left: [
        { icon: UserPlus,   name: 'Create Character',      description: 'Build a reusable Soul ID character with consistent appearance',  href: '/studio/characters/create' },
        { icon: Users,      name: 'My Characters',         description: 'Browse and manage all your saved character profiles',            href: '/studio/characters/mine' },
        { icon: UserX,      name: 'Character Swap',        description: 'Replace or swap characters inside any existing video',           href: '/studio/characters/swap' },
        { icon: Users,      name: 'Multi-character Scene', description: 'Place multiple different characters together in one scene',      href: '/studio/characters/multi',  badge: 'NEW' },
      ],
      right: [
        { icon: Globe, name: 'Create World',      description: 'Save a scene, location, or environment as a reusable preset',      href: '/studio/characters/worlds/create' },
        { icon: Map,   name: 'My Worlds',         description: 'Browse and manage all your saved world and scene presets',          href: '/studio/characters/worlds' },
        { icon: Sun,   name: 'Lighting Presets',  description: 'Golden hour, studio light, night, and custom lighting presets',    href: '/studio/characters/lighting' },
        { icon: Film,  name: 'Scene Templates',   description: 'Ready-made world templates for fast scene setup',                  href: '/studio/characters/templates' },
      ],
    },
  },

  {
    icon: GitMerge, label: 'Workflows', href: '/studio/workflows',
    flyout: {
      title: 'Workflows',
      leftLabel: 'Build', rightLabel: 'Run & Share',
      left: [
        { icon: LayoutGrid,     name: 'Canvas',          description: 'Infinite visual canvas for building AI workflow chains',      href: '/studio/workflows/canvas',    badge: 'NEW' },
        { icon: GitMerge,       name: 'Node Builder',    description: 'Drag-and-drop node-based AI pipeline builder',                href: '/studio/workflows/builder' },
        { icon: Save,           name: 'My Workflows',    description: 'All your saved, pinned, and recent workflow pipelines',      href: '/studio/workflows/mine' },
        { icon: LayoutTemplate, name: 'Templates',       description: 'Start instantly from pre-built workflow templates',          href: '/studio/workflows/templates' },
      ],
      right: [
        { icon: Users,    name: 'Community',       description: 'Browse and run workflows published by other creators',        href: '/studio/workflows/community' },
        { icon: Play,     name: 'Playground',      description: 'Run any workflow interactively with a live form UI',          href: '/studio/workflows/playground' },
        { icon: Calendar, name: 'Scheduled Runs',  description: 'Set any workflow to run automatically on a schedule',         href: '/studio/workflows/scheduled' },
        { icon: Share2,   name: 'Share Workflow',  description: 'Publish your workflow pipeline for others to use',            href: '/studio/workflows/share' },
      ],
    },
  },

  {
    icon: Bot, label: 'Agents', href: '/studio/agents',
    flyout: {
      title: 'AI Agents',
      leftLabel: 'My Agents', rightLabel: 'Integrate',
      left: [
        { icon: PlusCircle,     name: 'Create Agent',      description: 'Build a custom AI agent for automated content generation',     href: '/studio/agents/create' },
        { icon: Bot,            name: 'My Agents',         description: 'View and manage all your active and saved AI agents',          href: '/studio/agents/mine' },
        { icon: LayoutTemplate, name: 'Agent Templates',   description: 'Start from a pre-built agent template for common tasks',       href: '/studio/agents/templates' },
        { icon: Activity,       name: 'Agent Logs',        description: 'View complete run history, errors, and output logs',           href: '/studio/agents/logs' },
      ],
      right: [
        { icon: Server,   name: 'MCP Server',    description: 'Connect to Claude, OpenAI Codex, and other AI agent systems',   href: '/studio/agents/mcp',    badge: 'NEW' },
        { icon: Terminal, name: 'CLI Tool',      description: 'Terminal-based batch generation for developers and power users', href: '/studio/agents/cli' },
        { icon: Code,     name: 'API Access',    description: 'REST API endpoints for all generation features with full docs',  href: '/studio/agents/api' },
        { icon: Bell,     name: 'Webhooks',      description: 'Trigger agent runs from any external system or event',           href: '/studio/agents/webhooks' },
      ],
    },
  },

  {
    icon: Grid, label: 'Apps', href: '/studio/apps',
    flyout: {
      title: 'Explore Apps',
      leftLabel: 'Categories', rightLabel: 'Top Apps',
      left: [
        { icon: Sparkles,     name: 'All Apps',         description: '150+ one-click creative apps for every use case',              href: '/studio/apps/all' },
        { icon: Flame,        name: 'VFX & Effects',    description: 'Explosion, fire, raven, werewolf and 80+ viral effects',       href: '/studio/apps/vfx',     badge: 'TOP' },
        { icon: User,         name: 'Face & Character', description: 'Face swap, headshot generator, and skin enhancer apps',        href: '/studio/apps/face' },
        { icon: Palette,      name: 'Style & Color',    description: 'Color grading, artistic styles, and filter apps',              href: '/studio/apps/style' },
        { icon: ShoppingBag,  name: 'Product & Fashion', description: 'Fashion generator, product placement, and brand apps',       href: '/studio/apps/product' },
        { icon: Hash,         name: 'Meme & Social',    description: 'Meme maker, sticker generator, and match cut apps',           href: '/studio/apps/social' },
        { icon: Star,         name: 'Favorites',        description: 'All your pinned and most-used apps in one quick place',       href: '/studio/apps/favorites' },
        { icon: BadgeCheck,   name: 'New This Week',    description: 'The latest apps added to the platform this week',             href: '/studio/apps/new',     badge: 'NEW' },
      ],
      right: [
        { icon: UserX,    name: 'Face Swap',          description: 'Swap faces on any image or video instantly with AI',           href: '/studio/apps/face-swap',    badge: 'TOP' },
        { icon: Camera,   name: 'Angles 2.0',         description: '9 different angle shots generated from a single image',       href: '/studio/apps/angles' },
        { icon: Sun,      name: 'Skin Enhancer',      description: 'Professional AI skin retouching in a single click',           href: '/studio/apps/skin' },
        { icon: Film,     name: 'Match Cut',          description: 'Create the viral match cut transition effect automatically',  href: '/studio/apps/match-cut',    badge: 'NEW' },
        { icon: Smile,    name: 'Sticker Generator',  description: 'Create custom AI stickers from any image or prompt',          href: '/studio/apps/stickers' },
        { icon: Sparkles, name: 'Viral Effects Pack', description: '80 trending one-click VFX presets all in one pack',           href: '/studio/apps/effects',      badge: 'TOP' },
      ],
    },
  },

  {
    icon: Folder, label: 'Library', href: '/studio/media',
    flyout: {
      title: 'Media Library',
      leftLabel: 'Browse', rightLabel: 'Storage',
      left: [
        { icon: Grid,   name: 'All Assets',   description: 'Search and filter all your generated creative assets',              href: '/studio/media/all' },
        { icon: Image,  name: 'Images',       description: 'All AI-generated images organized and searchable',                  href: '/studio/media/images' },
        { icon: Video,  name: 'Videos',       description: 'All AI-generated videos with preview and download',                 href: '/studio/media/videos' },
        { icon: Mic,    name: 'Audio',        description: 'All voiceovers, music, and sound effects you have generated',       href: '/studio/media/audio' },
        { icon: Folder, name: 'Projects',     description: 'Organize your creations into named project folders',                href: '/studio/media/projects' },
      ],
      right: [
        { icon: HardDrive, name: 'Storage Quota',  description: 'View your current storage usage and available space',           href: '/studio/media/storage' },
        { icon: Cloud,     name: 'Google Drive',   description: 'Connect and auto-sync all outputs to Google Drive',             href: '/studio/media/drive' },
        { icon: Cloud,     name: 'Dropbox',        description: 'Connect and auto-sync all outputs to your Dropbox account',     href: '/studio/media/dropbox' },
        { icon: Download,  name: 'Bulk Download',  description: 'Select multiple assets and download everything as a ZIP file',  href: '/studio/media/download' },
      ],
    },
  },

  {
    icon: Calendar, label: 'Schedule', href: '/studio/schedule',
    flyout: {
      title: 'Schedule & Publish',
      leftLabel: 'Plan', rightLabel: 'Connect & Analyze',
      left: [
        { icon: Calendar, name: 'Calendar View',    description: 'Drag-and-drop visual content calendar for all your posts',      href: '/studio/schedule/calendar' },
        { icon: Clock,    name: 'Scheduled Posts',  description: 'View and manage all upcoming scheduled social media posts',     href: '/studio/schedule/posts' },
        { icon: Plus,     name: 'New Post',         description: 'Schedule a new post with AI caption and hashtag generation',    href: '/studio/schedule/new' },
      ],
      right: [
        { icon: Share2,   name: 'Connect Accounts',    description: 'Link TikTok, Instagram, YouTube, LinkedIn, and more',       href: '/studio/schedule/connect' },
        { icon: Hash,     name: 'Caption Generator',   description: 'AI-generated captions and trending hashtags for any post',  href: '/studio/schedule/captions' },
        { icon: BarChart, name: 'Post Analytics',      description: 'Track views, reach, engagement, and clicks per post',       href: '/studio/schedule/analytics' },
        { icon: Monitor,  name: 'Platform Formatter',  description: 'Auto-resize any video to the perfect format per platform',  href: '/studio/schedule/format' },
      ],
    },
  },

  { icon: Settings, label: 'Settings', href: '/studio/settings', flyout: null },
]
