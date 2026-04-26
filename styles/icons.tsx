import {
  ArrowLeft,
  CirclePlus,
  CircleX,
  EditIcon,
  EllipsisVertical,
  Heart,
  Home,
  Image,
  MapPin,
  MessageCircle,
  MoonStar,
  MoreHorizontal,
  Repeat2,
  Search,
  Settings,
  SmilePlus,
  User,
} from "lucide-react-native";
import { Animated } from "react-native";

const anim = (Component: any) => Animated.createAnimatedComponent(Component);

export const iconMapping = {
  more: anim(MoreHorizontal),
  message: anim(MessageCircle),
  configuration: anim(Settings),
  "back-row": anim(ArrowLeft),
  edit: anim(EditIcon),
  post: anim(CirclePlus),
  home: anim(Home),
  profile: anim(User),
  like: anim(Heart),
  repeat: anim(Repeat2),
  image: anim(Image),
  close: anim(CircleX),
  emoji: anim(SmilePlus),
  location: anim(MapPin),
  "more-vertical": anim(EllipsisVertical),
  moon: anim(MoonStar),
  search: anim(Search),
};
