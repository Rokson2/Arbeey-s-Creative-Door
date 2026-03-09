"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { GeneratedContent, ModelSettings, Category } from "@/lib/types";
import {
  ModelConfig,
  MODELS,
  getModelsByCategory,
  getDefaultModel,
  calculateCost,
  DEFAULT_ASPECT_RATIOS,
  DEFAULT_RESOLUTIONS,
  DEFAULT_DURATIONS,
  VIDEO_RESOLUTIONS,
} from "@/lib/models";
import { QueueProvider, useQueue, QueuePanel } from "@/components/queue";

import { Image as LucideIcon } from "lucide-react";

import { Plus, X, Trash2 } from "lucide-react";

import { Upload } from "lucide-react";

const { ImageIcon } from "lucide-react";

import { X } from "lucide-react";

import { GripVertical } from "lucide-react";

import { Loader2 } from "lucide-react";

import { CheckCircle } from "lucide-react";
import { AlertCircle } from "lucide-react";

import { Clock } from "lucide-react";

const { DollarSign } from "lucide-react";

import { RefreshCw } from "lucide-react";

import { Sparkles } from "lucide-react";

import { Wand2 } from "lucide-react";

import { Video } from "lucide-react";

import { ImageOff } from "lucide-react";

import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";

import { Settings } from "lucide-react";
import { Download } from "lucide-react";
import { Play } from "lucide-react";

const { Pause } from "lucide-react";

import { RotateCcw } from "lucide-react";

import { Shuffle } from "lucide-react";
import { SkipForward } from "lucide-react";
import { FastForward } from "lucide-react";
import { Rewind } from "lucide-react";
import { Volume2 } from "lucide-react";
import { VolumeX } from "lucide-react";
import { Zap } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { XCircle } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Info } from "lucide-react";
import { HelpCircle } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Box } from "lucide-react";
import { Layers } from "lucide-react";
import { Grid3X3 } from "lucide-react";
import { Layout } from "lucide-react";
import { Maximize2 } from "lucide-react";
import { Minimize2 } from "lucide-react";
import { Move } from "lucide-react";
import { ZoomIn } from "lucide-react";
import { ZoomOut } from "lucide-react";
import { Search } from "lucide-react";
import { Filter } from "lucide-react";
import { Sliders } from "lucide-react";
import { ToggleLeft } from "lucide-react";
import { ToggleRight } from "lucide-react";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { Cloud } from "lucide-react";
import { CloudRain } from "lucide-react";
import { CloudSnow } from "lucide-react";
import { Wind } from "lucide-react";
import { Droplet } from "lucide-react";
import { Leaf } from "lucide-react";
import { Flame } from "lucide-react";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { ThumbsUp } from "lucide-react";
import { ThumbsDown } from "lucide-react";
import { Heart } from "lucide-react";
import { Star } from "lucide-react";
import { Award } from "lucide-react";
import { Trophy } from "lucide-react";
import { Target } from "lucide-react";
import { Crosshair } from "lucide-react";
import { Shield } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { ShieldAlert } from "lucide-react";
import { Lock } from "lucide-react";
import { Unlock } from "lucide-react";
import { Key } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { Scan } from "lucide-react";
import { QrCode } from "lucide-react";
import { Barcode } from "lucide-react";
import { Link } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { Unlink } from "lucide-react";
import { Anchor } from "lucide-react";
import { Chain } from "lucide-react";
import { GitBranch } from "lucide-react";
import { GitCommit } from "lucide-react";
import { GitPullRequest } from "lucide-react";
import { GitMerge } from "lucide-react";
import { Folder } from "lucide-react";
import { FolderOpen } from "lucide-react";
import { FolderPlus } from "lucide-react";
import { Folders } from "lucide-react";
import { File } from "lucide-react";
import { FileText } from "lucide-react";
import { FilePlus } from "lucide-react";
import { FileMinus } from "lucide-react";
import { FileCheck } from "lucide-react";
import { FileX } from "lucide-react";
import { Save } from "lucide-react";
import { FileDown } from "lucide-react";
import { Upload } from "lucide-react";
import { HardDrive } from "lucide-react";
import { Database } from "lucide-react";
import { Server } from "lucide-react";
import { Wifi } from "lucide-react";
import { WifiOff } from "lucide-react";
import { Monitor } from "lucide-react";
import { Smartphone } from "lucide-react";
import { Tablet } from "lucide-react";
import { Laptop } from "lucide-react";
import { Tv } from "lucide-react";
import { Radio } from "lucide-react";
import { Speaker } from "lucide-react";
import { Headphones } from "lucide-react";
import { Music } from "lucide-react";
import { Mic } from "lucide-react";
import { Camera } from "lucide-react";
import { Video } from "lucide-react";
import { Film } from "lucide-react";
import { Clapperboard } from "lucide-react";
import { Watch } from "lucide-react";
import { Timer } from "lucide-react";
import { Hourglass } from "lucide-react";
import { Calendar } from "lucide-react";
import { Bell } from "lucide-react";
import { BellRing } from "lucide-react";
import { BellOff } from "lucide-react";
import { Mail } from "lucide-react";
import { Phone } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Send } from "lucide-react";
import { PaperPlane } from "lucide-react";
import { MapPin } from "lucide-react";
import { Map } from "lucide-react";
import { Compass } from "lucide-react";
import { Navigation } from "lucide-react";
import { Locate } from "lucide-react";
import { Globe } from "lucide-react";
import { MapPinned } from "lucide-react";
import { Rocket } from "lucide-react";
import { Plane } from "lucide-react";
import { Car } from "lucide-react";
import { Bike } from "lucide-react";
import { Train } from "lucide-react";
import { Bus } from "lucide-react";
import { Truck } from "lucide-react";
import { Ship } from "lucide-react";
import { Boat } from "lucide-react";
import { Anchor } from "lucide-react";
import { LifeBuoy } from "lucide-react";
import { Flag } from "lucide-react";
import { FlagOff } from "lucide-react";
import { FlagTriangle } from "lucide-react";
import { FlagVariant } from "lucide-react";
import { Swords } from "lucide-react";
import { Axe } from "lucide-react";
import { Hammer } from "lucide-react";
import { Wrench } from "lucide-react";
import { Screwdriver } from "lucide-react";
import { Nut } from "lucide-react";
import { Bolt } from "lucide-react";
import { Cog } from "lucide-react";
import { Settings } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";
import { SlidersVertical } from "lucide-react";
import { Filter } from "lucide-react";
import { Edit } from "lucide-react";
import { Edit2 } from "lucide-react";
import { Edit3 } from "lucide-react";
import { PenTool } from "lucide-react";
import { Pencil } from "lucide-react";
import { Eraser } from "lucide-react";
import { Paintbrush } from "lucide-react";
import { Paintbrush2 } from "lucide-react";
import { Palette } from "lucide-react";
import { Pipette } from "lucide-react";
import { Droplets } from "lucide-react";
import { SprayCan } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { LightbulbOff } from "lucide-react";
import { Zap } from "lucide-react";
import { Power } from "lucide-react";
import { Plug } from "lucide-react";
import { Battery } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { BatteryLow } from "lucide-react";
import { BatteryWarning } from "lucide-react";
import { ZapOff } from "lucide-react";
import { Monitor } from "lucide-react";
import { Moon } from "lucide-react";
import { Sun } from "lucide-react";
import { Sunrise } from "lucide-react";
import { Sunset } from "lucide-react";
import { Cloud } from "lucide-react";
import { CloudRain } from "lucide-react";
import { CloudSnow } from "lucide-react";
import { CloudLightning } from "lucide-react";
import { CloudDrizzle } from "lucide-react";
import { CloudFog } from "lucide-react";
import { CloudMoon } from "lucide-react";
import { CloudSun } from "lucide-react";
import { Thermometer } from "lucide-react";
import { ThermometerSun } from "lucide-react";
import { ThermometerSnowflake } from "lucide-react";
import { Droplets } from "lucide-react";
import { Umbrella } from "lucide-react";
import { Wind } from "lucide-react";
import { Snowflake } from "lucide-react";
import { Flame } from "lucide-react";
import { Fire } from "lucide-react";
import { Droplet } from "lucide-react";
import { Droplets } from "lucide-react";
import { Waves } from "lucide-react";
import { Coffee } from "lucide-react";
import { CupSoda } from "lucide-react";
import { Pizza } from "lucide-react";
import { Utensils } from "lucide-react";
import { Drumstick } from "lucide-react";
import { Music2 } from "lucide-react";
import { Music3 } from "lucide-react";
import { Music4 } from "lucide-react";
import { Radio } from "lucide-react";
import { Headphones } from "lucide-react";
import { Speaker } from "lucide-react";
import { Volume2 } from "lucide-react";
import { Volume1 } from "lucide-react";
import { VolumeX } from "lucide-react";
import { Mic } from "lucide-react";
import { Mic2 } from "lucide-react";
import { MicOff } from "lucide-react";
import { Video } from "lucide-react";
import { VideoOff } from "lucide-react";
import { Film } from "lucide-react";
import { Clapperboard } from "lucide-react";
import { Tv } from "lucide-react";
import { Tv2 } from "lucide-react";
import { Cast } from "lucide-react";
import { Clapperboard } from "lucide-react";
import { Projector } from "lucide-react";
import { Camera } from "lucide-react";
import { CameraOff } from "lucide-react";
import { Aperture } from "lucide-react";
import { Focus } from "lucide-react";
import { ZoomIn } from "lucide-react";
import { ZoomOut } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { Move } from "lucide-react";
import { Maximize2 } from "lucide-react";
import { Minimize2 } from "lucide-react";
import { Layers } from "lucide-react";
import { Grid3X3 } from "lucide-react";
import { Layout } from "lucide-react";
import { Palette } from "lucide-react";
import { Brush } from "lucide-react";
import { PenTool } from "lucide-react";
import { Eraser } from "lucide-react";
import { Scissors } from "lucide-react";
import { Copy } from "lucide-react";
import { Clipboard } from "lucide-react";
import { ClipboardList } from "lucide-react";
import { ClipboardCheck } from "lucide-react";
import { ClipboardX } from "lucide-react";
import { Paste } from "lucide-react";
import { Type } from "lucide-react";
import { FontBold } from "lucide-react";
import { FontItalic } from "lucide-react";
import { Underline } from "lucide-react";
import { Strikethrough } from "lucide-react";
import { AlignLeft } from "lucide-react";
import { AlignCenter } from "lucide-react";
import { AlignRight } from "lucide-react";
import { AlignJustify } from "lucide-react";
import { List } from "lucide-react";
import { ListOrdered } from "lucide-react";
import { ListChecks } from "lucide-react";
import { ListX } from "lucide-react";
import { ListPlus } from "lucide-react";
import { ListMinus } from "lucide-react";
import { Indent } from "lucide-react";
import { Outdent } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { ChevronsLeft } from "lucide-react";
import { ChevronsRight } from "lucide-react";
import { ChevronsUp } from "lucide-react";
import { ChevronsDown } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { ArrowUp } from "lucide-react";
import { ArrowDown } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { ArrowUpLeft } from "lucide-react";
import { ArrowDownRight } from "lucide-react";
import { ArrowDownLeft } from "lucide-react";
import { ArrowsUp } from "lucide-react";
import { MoveRight } from "lucide-react";
import { MoveLeft } from "lucide-react";
import { MoveUp } from "lucide-react";
import { MoveDown } from "lucide-react";
import { MoveDiagonal } from "lucide-react";
import { MoveHorizontal } from "lucide-react";
import { MoveVertical } from "lucide-react";
import { CornerUpRight } from "lucide-react";
import { CornerUpLeft } from "lucide-react";
import { CornerDownRight } from "lucide-react";
import { CornerDownLeft } from "lucide-react";
import { Play } from "lucide-react";
import { Pause } from "lucide-react";
import { Square } from "lucide-react";
import { SquareSlash } from "lucide-react";
import { Circle } from "lucide-react";
import { CircleDot } from "lucide-react";
import { CircleOff } from "lucide-react";
import { CircleSlash } from "lucide-react";
import { CircleUser } from "lucide-react";
import { CircleCheck } from "lucide-react";
import { CircleX } from "lucide-react";
import { CirclePlus } from "lucide-react";
import { CircleMinus } from "lucide-react";
import { CircleEllipsis } from "lucide-react";
import { CircleArrowRight } from "lucide-react";
import { CircleArrowLeft } from "lucide-react";
import { CircleArrowUp } from "lucide-react";
import { CircleArrowDown } from "lucide-react";
import { Diamond } from "lucide-react";
import { Hexagon } from "lucide-react";
import { Pentagon } from "lucide-react";
import { Octagon } from "lucide-react";
import { Star } from "lucide-react";
import { StarHalf } from "lucide-react";
import { StarOff } from "lucide-react";
import { Stamp } from "lucide-react";
import { Bookmark } from "lucide-react";
import { BookmarkPlus } from "lucide-react";
import { BookmarkMinus } from "lucide-react";
import { BookmarkCheck } from "lucide-react";
import { BookmarkX } from "lucide-react";
import { Tag } from "lucide-react";
import { Tags } from "lucide-react";
import { TagPlus } from "lucide-react";
import { TagMinus } from "lucide-react";
import { TagX } from "lucide-react";
import { Award } from "lucide-react";
import { Trophy } from "lucide-react";
import { Medal } from "lucide-react";
import { Ribbon } from "lucide-react";
import { Gift } from "lucide-react";
import { Crown } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Zap } from "lucide-react";
import { Flame } from "lucide-react";
import { Flashlight } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { Candle } from "lucide-react";
import { Highlighter } from "lucide-react";
import { Sun } from "lucide-react";
import { Sunrise } from "lucide-react";
import { Sunset } from "lucide-react";
import { Moon } from "lucide-react";
import { Cloud } from "lucide-react";
import { CloudRain } from "lucide-react";
import { CloudSnow } from "lucide-react";
import { CloudLightning } from "lucide-react";
import { CloudDrizzle } from "lucide-react";
import { CloudFog } from "lucide-react";
import { CloudMoon } from "lucide-react";
import { CloudSun } from "lucide-react";
import { Wind } from "lucide-react";
import { WindArrowLeft } from "lucide-react";
import { WindArrowRight } from "lucide-react";
import { Thermometer } from "lucide-react";
import { ThermometerSun } from "lucide-react";
import { ThermometerSnowflake } from "lucide-react";
import { Droplets } from "lucide-react";
import { Droplet } from "lucide-react";
import { Umbrella } from "lucide-react";
import { Snowflake } from "lucide-react";
import { TreeDeciduous } from "lucide-react";
import { TreePine } from "lucide-react";
import { Trees } from "lucide-react";
import { Leaf } from "lucide-react";
import { Flower } from "lucide-react";
import { Flower2 } from "lucide-react";
import { Sprout } from "lucide-react";
import { Cherry } from "lucide-react";
import { Apple } from "lucide-react";
import { Lemon } from "lucide-react";
import { Banana } from "lucide-react";
import { Peach } from "lucide-react";
import { Grape } from "lucide-react";
import { Cherry } from "lucide-react";
import { Carrot } from "lucide-react";
import { Corn } from "lucide-react";
import { Wheat } from "lucide-react";
import { WheatOff } from "lucide-react";
import { Beef } from "lucide-react";
import { Egg } from "lucide-react";
import { EggFried } from "lucide-react";
import { EggOff } from "lucide-react";
import { Cookie } from "lucide-react";
import { Candy } from "lucide-react";
import { CandyOff } from "lucide-react";
import { Cake } from "lucide-react";
import { CakeSlice } from "lucide-react";
import { Pizza } from "lucide-react";
import { PizzaSlice } from "lucide-react";
import { Coffee } from "lucide-react";
import { Croissant } from "lucide-react";
import { Sandwich } from "lucide-react";
import { Hotdog } from "lucide-react";
import { Drumstick } from "lucide-react";
import { Fish } from "lucide-react";
import { Shrimp } from "lucide-react";
import { Lobster } from "lucide-react";
import { Crab } from "lucide-react";
import { IceCream } from "lucide-react";
import { IceCream2 } from "lucide-react";
import { Lollipop } from "lucide-react";
import { CandyCane } from "lucide-react";
import { Cookie } from "lucide-react";
import { Donut } from "lucide-react";
import { Popcorn } from "lucide-react";
import { Soda } from "lucide-react";
import { Beer } from "lucide-react";
import { BeerMug } from "lucide-react";
import { Wine } from "lucide-react";
import { WineOff } from "lucide-react";
import { Martini } from "lucide-react";
import { Cocktail } from "lucide-react";
import { GlassWater } from "lucide-react";
import { Coffee } from "lucide-react";
import { Mug } from "lucide-react";
import { MugHot } from "lucide-react";
import { TeaPot } from "lucide-react";
import { Kettle } from "lucide-react";
import { Pot } from "lucide-react";
import { ChefHat } from "lucide-react";
import { UtensilsCrossed } from "lucide-react";
import { Fork } from "lucide-react";
import { Knife } from "lucide-react";
import { Spoon } from "lucide-react";
import { Bowl } from "lucide-react";
import { Plate } from "lucide-react";
import { Tray } from "lucide-react";
import { CookingPot } from "lucide-react";
import { Refrigerator } from "lucide-react";
import { Store } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import { ShoppingBasket } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { Wallet } from "lucide-react";
import { CreditCard } from "lucide-react";
import { Banknote } from "lucide-react";
import { Coins } from "lucide-react";
import { DollarSign } from "lucide-react";
import { PiggyBank } from "lucide-react";
import { Percent } from "lucide-react";
import { Calculator } from "lucide-react";
import { BarChart2 } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { LineChart } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { TrendingDown } from "lucide-react";
import { Activity } from "lucide-react";
import { Gauge } from "lucide-react";
import { Dashboard } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { PanelTop } from "lucide-react";
import { PanelBottom } from "lucide-react";
import { PanelLeft } from "lucide-react";
import { PanelRight } from "lucide-react";
import { PanelTopClose } from "lucide-react";
import { PanelBottomClose } from "lucide-react";
import { PanelLeftClose } from "lucide-react";
import { PanelRightClose } from "lucide-react";
import { Menu } from "lucide-react";
import { MenuSquare } from "lucide-react";
import { MenuArrow } from "lucide-react";
import { X } from "lucide-react";
import { Check } from "lucide-react";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { MinusCircle } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { XCircle } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Info } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { HelpCircle } from "lucide-react";
import { Bell } from "lucide-react";
import { BellPlus } from "lucide-react";
import { BellRing } from "lucide-react";
import { BellMinus } from "lucide-react";
import { BellOff } from "lucide-react";
import { Badge } from "lucide-react";
import { BadgeCheck } from "lucide-react";
import { BadgeX } from "lucide-react";
import { BadgeAlert } from "lucide-react";
import { BadgePercent } from "lucide-react";
import { BadgeDollarSign } from "lucide-react";
import { BadgeEuro } from "lucide-react";
import { BadgePound } from "lucide-react";
import { BadgeYen } from "lucide-react";
import { BadgeRupee } from "lucide-react";
import { BadgeCent } from "lucide-react";

const CATEGORY_LABELS: Record<Category, string> = {
  "text-to-image": "Text → Image",
  "image-to-image": "Image → Image",
  "text-to-video": "Text → Video",
  "image-to-video": "Image → Video",
};

import { useState, useCallback, useRef, useEffect } from "react";
import type { GeneratedContent, ModelSettings, Category } from "@/lib/types";
import {
  ModelConfig,
  MODELS,
  getModelsByCategory,
  getDefaultModel,
  calculateCost,
  DEFAULT_ASPECT_RATIOS,
  DEFAULT_RESOLUTIONS,
  DEFAULT_DURATIONS,
  VIDEO_RESOLUTIONS,
} from "@/lib/models";
import { QueueProvider, useQueue, QueuePanel } from "@/components/queue";

const CATEGORY_LABELS: Record<Category, string> = {
  "text-to-image": "Text → Image",
  "image-to-image": "Image → Image",
  "text-to-video": "Text → Video",
  "image-to-video": "Image → Video",
};

function HomeContent() {
  const [category, setCategory] = useState<Category>("text-to-image");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [referenceImages, setReferenceImages] = useState<string[]>([]); // Changed to array
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [modelSettings, setModelSettings] = useState<ModelSettings>({
    aspectRatio: "1:1",
    resolution: "1K",
    imageSize: "auto_2K",
    duration: 5,
    numOutputs: 1,
    seed: null,
    cfgScale: 0.5,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [sessionSpent, setSessionSpent] = useState(0);
  const [spendingLimit, setSpendingLimit] = useState(5);
  const [showModelSettings, setShowModelSettings] = useState(false);
  const [urlInput, setUrlInput] = useState(""); // New state for URL input

  const { addToQueue, queue, completedItems } = useQueue();
  // Load saved settings
    useEffect(() => {
    const storedApiKey = localStorage.getItem("fal-api-key");
    const storedLimit = localStorage.getItem("fal-spending-limit");
    if (storedApiKey) setApiKey(storedApiKey);
    if (storedLimit) setSpendingLimit(parseFloat(storedLimit));
  }, []);
  // Save settings
    useEffect(() => {
    localStorage.setItem("fal-api-key", apiKey);
  }, [apiKey]);
    useEffect(() => {
    localStorage.setItem("fal-spending-limit", spendingLimit.toString());
  }, [spendingLimit]);
    // Set default model when category changes
    useEffect(() => {
    const defaultModel = getDefaultModel(category);
    setSelectedModelId(defaultModel.id);
    setModelSettings({
      aspectRatio: defaultModel.defaults.aspectRatio || "1:1",
      resolution: defaultModel.defaults.resolution || "1K",
      imageSize: defaultModel.defaults.imageSize || "auto_2K",
      duration: defaultModel.defaults.duration || 5,
      numOutputs: defaultModel.defaults.numOutputs,
      seed: defaultModel.defaults.seed ?? null,
      steps: defaultModel.defaults.steps,
      guidanceScale: defaultModel.defaults.guidanceScale,
      cfgScale: defaultModel.defaults.cfgScale ?? 0.5,
    });
    setReferenceImages([]); // Clear images when category changes
  }, [category]);
    // Listen for completed queue items and add to generated content
    useEffect(() => {
    completedItems.forEach((item) => {
      if (item.results && item.results.length > 0) {
        setGeneratedContent((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newContent = item.results!.filter((r) => !existingIds.has(r.id));
          if (newContent.length > 0) {
            setSessionSpent((prevSpent) => prevSpent + item.cost);
          }
          return [...newContent, ...prev];
        });
      }
    });
  }, [completedItems]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const promptRef = useRef<HTMLTextAreaElement>(null);
    const selectedModel = selectedModelId ? MODELS[selectedModelId] : null;
    const estimatedCost = selectedModel ? calculateCost(selectedModelId, modelSettings.numOutputs) : 0;
    const isOverLimit = sessionSpent >= spendingLimit;
    const isNearLimit = sessionSpent / spendingLimit >= 0.8 && !isOverLimit;
    const requiresReferenceImage = category === "image-to-image" || category === "image-to-video";
    const isVideoCategory = category === "text-to-video" || category === "image-to-video";
    const supportsMultipleImages = selectedModel?.supportsMultipleImages || false;
    const handleCategoryChange = (newCategory: Category) => {
      setCategory(newCategory);
      setPrompt("");
      clearReferenceImages();
      setUrlInput("");
      setError(null);
    };
    const handleModelChange = (modelId: string) => {
      const model = MODELS[modelId];
      if (!model) return;
      setSelectedModelId(modelId);
      setModelSettings({
        aspectRatio: model.defaults.aspectRatio || "1:1",
        resolution: model.defaults.resolution || "1K",
        imageSize: model.defaults.imageSize || "auto_2K",
        duration: model.defaults.duration || 5,
        numOutputs: model.defaults.numOutputs,
        seed: model.defaults.seed ?? null,
        steps: model.defaults.steps,
        guidanceScale: model.defaults.guidanceScale,
        cfgScale: model.defaults.cfgScale ?? 0.5,
      });
      setReferenceImages([]); // Clear images when model changes
    };
    const handleFileUpload = useCallback((file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setReferenceImages((prev) => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    }, []);
    const handleUrlInput = useCallback(() => {
      const url = urlInput.trim();
      if (!url) return;
      setReferenceImages((prev) => [...prev, url]);
      setUrlInput("");
    }, [urlInput]);
    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        files.forEach((file) => {
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const base64 = ev.target?.result as string;
              setReferenceImages((prev) => [...prev, base64]);
            };
            reader.readAsDataURL(file);
          }
        });
      },
      []
    );
    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
    }, []);
    const handleFileInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach((file) => {
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const base64 = ev.target?.result as string;
              setReferenceImages((prev) => [...prev, base64]);
            };
            reader.readAsDataURL(file);
          }
        });
      },
      []
    );
    const removeImage = (index: number) => {
      setReferenceImages((prev) => prev.filter((_, i) => i !== index));
    };
    const clearReferenceImages = () => {
      setReferenceImages([]);
      setUrlInput("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    const handleGenerate = () => {
      if (!apiKey.trim()) {
        setError("Please enter your fal.ai API key in settings");
        return;
      }
      if (!prompt.trim() && category !== "image-to-video") {
        setError("Please enter a prompt");
        return;
      }
      if (requiresReferenceImage && referenceImages.length === 0) {
        setError(`At least one reference image is required for ${CATEGORY_LABELS[category]}`);
        return;
      }
      if (isOverLimit) {
        setError("Session spending limit reached. Reset session to continue.");
        return;
      }
      if (!selectedModelId) {
        setError("Please select a model");
        return;
      }
      setError(null);
      // Add to queue - pass array of images
      addToQueue(
        selectedModelId,
        category,
        prompt.trim(),
        referenceImages.length > 0 ? referenceImages : undefined,
        modelSettings,
        apiKey
      );
    };
    const handleDownload = async (url: string, fileName: string) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName || "generated-content";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch {
        setError("Failed to download file");
      }
    };
    const handleUseAsReference = (imageUrl: string) => {
      setReferenceImages([imageUrl]);
      if (category === "text-to-image") {
        setCategory("image-to-image");
      } else if (category === "text-to-video") {
        setCategory("image-to-video");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        promptRef.current?.focus();
      }, 300);
    };
    const resetSession = () => {
      setSessionSpent(0);
      setError(null);
    };
    const modelsInCategory = getModelsByCategory(category);
    const aspectRatioOptions = selectedModel?.aspectRatioOptions || DEFAULT_ASPECT_RATIOS;
    const resolutionOptions = isVideoCategory
      ? (selectedModel?.resolutionOptions || VIDEO_RESOLUTIONS)
      : (selectedModel?.resolutionOptions || DEFAULT_RESOLUTIONS);
    const durationOptions = selectedModel?.durationOptions || DEFAULT_DURATIONS;
    // Only disable if missing required inputs - NOT if queue is processing!
    const isGenerateDisabled =
      (!prompt.trim() && category !== "image-to-video") ||
      !apiKey.trim() ||
      isOverLimit ||
      (requiresReferenceImage && referenceImages.length === 0);
    const activeQueueCount = queue.filter((i) => i.status === "generating" || i.status === "pending").length;
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
        <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold tracking-tight">Arbeey&apos;s Creative Door</h1>
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                  isOverLimit
                    ? "bg-red-950/50 text-red-400"
                    : isNearLimit
                    ? "bg-yellow-950/50 text-yellow-400"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                <span>
                  Spent: ${sessionSpent.toFixed(2)} / ${spendingLimit.toFixed(2)} limit
                </span>
                {activeQueueCount > 0 && (
                  <span className="ml-1 rounded bg-blue-900/50 px-1.5 py-0.5 text-xs font-medium text-blue-300">
                    {activeQueueCount} generating
                  </span>
                )}
                {isOverLimit && (
                  <span className="ml-1 rounded bg-red-900/50 px-1.5 py-0.5 text-xs font-medium">LIMIT</span>
                )}
                {isNearLimit && !isOverLimit && (
                  <span className="ml-1 rounded bg-yellow-900/50 px-1.5 py-0.5 text-xs font-medium">WARN</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetSession}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                Reset Session
              </button>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Settings className="w-[18px] h-[18px]" />
                Settings
              </button>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
            <div className="space-y-6">
              {/* Category Tabs */}
              <div className="flex gap-2">
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      category === cat
                        ? "bg-white text-zinc-950"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
              {/* Model Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Model</label>
                <select
                  value={selectedModelId}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                >
                  {modelsInCategory.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} - ${model.costPerUnit.toFixed(3)}/{model.unit}
                      {model.supportsMultipleImages && " (Multi-image)"}
                    </option>
                  ))}
                </select>
                {selectedModel?.description && (
                  <p className="text-xs text-zinc-500">
                    {selectedModel.description}
                    {selectedModel.supportsMultipleImages && " - Supports multiple reference images"}
                  </p>
                )}
              </div>
              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">
                  Prompt {category === "image-to-video" && <span className="text-zinc-600">(Optional)</span>}
                </label>
                <textarea
                  ref={promptRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    isVideoCategory
                      ? "Describe the video you want to generate..."
                      : "Describe the image you want to generate..."
                  }
                  className="h-32 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600/20"
                />
              </div>
              {/* Reference Images Upload */}
              {requiresReferenceImage && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">
                    Reference Images{" "}
                    <span className={category === "image-to-image" ? "text-red-400" : "text-zinc-600"}>
                      ({category === "image-to-image" ? "Required" : "Optional"})
                    </span>
                    {supportsMultipleImages && (
                      <span className="ml-2 text-xs text-blue-400">
                        Add up to 4 images
                      </span>
                    )}
                  </label>
                  {/* Image Previews */}
                  {referenceImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {referenceImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Reference ${index + 1}`}
                            className="h-20 w-20 rounded-lg object-cover border border-zinc-700"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Drop Zone */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors ${
                      referenceImages.length >= 4
                        ? "border-zinc-700 bg-zinc-900/30 cursor-not-allowed"
                        : "border-zinc-700 bg-zinc-900/30 hover:border-zinc-600 hover:bg-zinc-900/50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      multiple={supportsMultipleImages}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center py-6">
                      <Upload className="mb-2 w-8 h-8 text-zinc-600" />
                      <p className="text-sm text-zinc-500">
                        {supportsMultipleImages
                          ? "Drag & drop or click to upload (multiple allowed)"
                          : "Drag & drop or click to upload"}
                      </p>
                    </div>
                  </div>
                  {/* URL Input */}
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-zinc-800" />
                    <span className="text-xs text-zinc-600">or</span>
                    <div className="h-px flex-1 bg-zinc-800" />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Paste image URL..."
                      className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUrlInput();
                        }
                      }}
                    />
                    <button
                      onClick={handleUrlInput}
                      className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
                    >
                      Add
                    </button>
                  </div>
                  {/* Clear All Button */}
                  {referenceImages.length > 0 && (
                    <button
                      onClick={clearReferenceImages}
                      className="w-full text-sm text-zinc-500 hover:text-zinc-400 transition-colors"
                    >
                      Clear all images
                    </button>
                  )}
                </div>
              )}
              {/* Model Settings */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
                <button
                  onClick={() => setShowModelSettings(!showModelSettings)}
                  className="flex w-full items-center justify-between p-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-400">Model Settings</span>
                  </div>
                  {showModelSettings ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </button>
                {showModelSettings && selectedModel && (
                  <div className="grid grid-cols-2 gap-4 p-4 pt-0">
                    {selectedModel.params.aspectRatio && (
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Aspect Ratio</label>
                        <select
                          value={modelSettings.aspectRatio}
                          onChange={(e) => setModelSettings((s) => ({ ...s, aspectRatio: e.target.value }))}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                        >
                          {aspectRatioOptions.map((ar) => (
                            <option key={ar} value={ar}>
                              {ar}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedModel.params.resolution && (
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Resolution</label>
                        <select
                          value={modelSettings.resolution}
                          onChange={(e) => setModelSettings((s) => ({ ...s, resolution: e.target.value }))}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                        >
                          {resolutionOptions.map((res) => (
                            <option key={res} value={res}>
                              {res}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedModel.params.duration && isVideoCategory && (
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Duration (s)</label>
                        <select
                          value={modelSettings.duration}
                          onChange={(e) => setModelSettings((s) => ({ ...s, duration: parseInt(e.target.value) }))}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                        >
                          {durationOptions.map((dur) => (
                            <option key={dur} value={dur}>
                              {dur}s
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedModel.params.numOutputs && (
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Number of Outputs</label>
                        <select
                          value={modelSettings.numOutputs}
                          onChange={(e) => setModelSettings((s) => ({ ...s, numOutputs: parseInt(e.target.value) }))}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                        >
                          {[1, 2, 3, 4].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedModel.params.seed && (
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Seed (Optional)</label>
                        <input
                          type="number"
                          value={modelSettings.seed ?? ""}
                          onChange={(e) =>
                            setModelSettings((s) => ({
                              ...s,
                              seed: e.target.value ? parseInt(e.target.value) : null,
                            }))
                          }
                          placeholder="Random"
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
                        />
                      </div>
                    )}
                    {selectedModel.params.steps && (
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Steps</label>
                        <input
                          type="number"
                          value={modelSettings.steps ?? ""}
                          onChange={(e) =>
                            setModelSettings((s) => ({
                              ...s,
                              steps: e.target.value ? parseInt(e.target.value) : undefined,
                            }))
                          }
                          placeholder="Default"
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
                        />
                      </div>
                    )}
                    {selectedModel.params.guidanceScale && (
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Guidance Scale</label>
                        <input
                          type="number"
                          step="0.1"
                          value={modelSettings.guidanceScale ?? ""}
                          onChange={(e) =>
                            setModelSettings((s) => ({
                              ...s,
                              guidanceScale: e.target.value ? parseFloat(e.target.value) : undefined,
                            }))
                          }
                          placeholder="Default"
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
                        />
                      </div>
                    )}
                    {selectedModel.params.imageSize && (
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Image Size</label>
                        <select
                          value={modelSettings.imageSize || "auto_2K"}
                          onChange={(e) => setModelSettings((s) => ({ ...s, imageSize: e.target.value }))}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                        >
                          {(selectedModel.imageSizeOptions || []).map((size: string) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedModel.params.cfgScale && (
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-500">CFG Scale</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="1"
                          value={modelSettings.cfgScale ?? 0.5}
                          onChange={(e) => setModelSettings((s) => ({ ...s, cfgScale: parseFloat(e.target.value) }))}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Error Display */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              {/* Generate Button */}
              <div className="space-y-2">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerateDisabled}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-zinc-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Sparkles className="w-[18px] h-[18px]" />
                  Generate - Est: ${estimatedCost.toFixed(3)}
                </button>
                <p className="text-center text-xs text-zinc-500">
                  {activeQueueCount > 0 
                    ? `${activeQueueCount} item${activeQueueCount > 1 ? 's' : ''} in queue - submit more!`
                    : "Submit multiple requests - they will process in parallel"}
                </p>
              </div>
              {/* Generated Content Gallery */}
              {generatedContent.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Generated Content</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {generatedContent.map((content) => (
                      <div
                        key={content.id}
                        className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
                      >
                        <div className="relative aspect-square">
                          {content.outputType === "video" ? (
                            <video
                              src={content.url}
                              controls
                              className="h-full w-full object-cover"
                              poster={content.thumbnailUrl}
                            />
                          ) : (
                            <img
                              src={content.url}
                              alt={content.prompt}
                              className="h-full w-full object-cover"
                            />
                          )}
                          <div className="absolute right-2 top-2 flex gap-2">
                            {content.outputType === "image" && (
                              <button
                                onClick={() => handleUseAsReference(content.url)}
                                className="rounded-lg bg-zinc-950/80 px-2 py-1.5 text-xs font-medium text-zinc-100 backdrop-blur-sm transition-colors hover:bg-zinc-950"
                              >
                                Use as Reference
                              </button>
                            )}
                            <button
                              onClick={() => handleDownload(content.url, content.fileName)}
                              title="Downloads to your Downloads folder"
                              className="rounded-lg bg-zinc-950/80 p-2 text-zinc-100 backdrop-blur-sm transition-colors hover:bg-zinc-950"
                            >
                              <Download className="w-[18px] h-[18px]" />
                            </button>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="line-clamp-2 text-sm text-zinc-400">{content.prompt}</p>
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                            <span>Cost: ${content.cost.toFixed(3)}</span>
                            <span>Model: {content.modelName}</span>
                            <span>{CATEGORY_LABELS[content.category]}</span>
                          </div>
                          <p className="mt-1 text-xs text-zinc-600">{content.timestamp.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-xs text-zinc-600">
                    Files are downloaded to your Downloads folder when you click the download button
                  </p>
                </div>
              )}
            </div>
            {/* Settings Panel */}
            <div
              className={`space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all ${
                isSettingsOpen ? "block" : "hidden"
              }`}
            >
              <h3 className="font-semibold">User Settings</h3>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">fal.ai API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your fal.ai API key"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 pr-10 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-100"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-zinc-500">
                  Get your key at{" "}
                  <a
                    href="https://fal.ai/dashboard/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 underline hover:text-zinc-300"
                  >
                    fal.ai/dashboard/keys
                  </a>
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Session Spending Limit ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={spendingLimit}
                  onChange={(e) => setSpendingLimit(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
                />
                <p className="text-xs text-zinc-600">
                  Account balance is not available via API. Check your balance at{" "}
                  <a
                    href="https://fal.ai/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 underline hover:text-zinc-300"
                  >
                    fal.ai/dashboard
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Queue Panel - Fixed at bottom right */}
        <QueuePanel />
      </div>
    );
  }
  export default function Home() {
    return (
      <QueueProvider>
        <HomeContent />
      </QueueProvider>
    );
  }
