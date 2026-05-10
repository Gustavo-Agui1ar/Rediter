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
import React, { forwardRef } from "react";
import { Animated } from "react-native";

const anim = (Component: any) => Animated.createAnimatedComponent(Component);

const AnimatedMore = anim(MoreHorizontal);
const AnimatedMessage = anim(MessageCircle);
const AnimatedSettings = anim(Settings);
const AnimatedArrowLeft = anim(ArrowLeft);
const AnimatedEdit = anim(EditIcon);
const AnimatedPost = anim(CirclePlus);
const AnimatedHome = anim(Home);
const AnimatedUser = anim(User);
const AnimatedHeart = anim(Heart);
const AnimatedRepeat = anim(Repeat2);
const AnimatedImage = anim(Image);
const AnimatedClose = anim(CircleX);
const AnimatedEmoji = anim(SmilePlus);
const AnimatedLocation = anim(MapPin);
const AnimatedMoreVertical = anim(EllipsisVertical);
const AnimatedMoon = anim(MoonStar);
const AnimatedSearch = anim(Search);

const HeartFilledBase = forwardRef<any, any>((props, ref) => (
  <Heart
    {...props}
    ref={ref}
    fill={props.color}
    color={props.color}
    strokeWidth={1.8}
  />
));

const AnimatedHeartFilled = anim(HeartFilledBase);

export const ICON_NAMES = [
  "more",
  "message",
  "configuration",
  "back-row",
  "edit",
  "post",
  "home",
  "profile",
  "like",
  "likeFilled",
  "repeat",
  "image",
  "close",
  "emoji",
  "location",
  "more-vertical",
  "moon",
  "search",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export const iconMapping: Record<IconName, any> = {
  more: AnimatedMore,
  message: AnimatedMessage,
  configuration: AnimatedSettings,
  "back-row": AnimatedArrowLeft,
  edit: AnimatedEdit,
  post: AnimatedPost,
  home: AnimatedHome,
  profile: AnimatedUser,
  like: AnimatedHeart,
  likeFilled: AnimatedHeartFilled,
  repeat: AnimatedRepeat,
  image: AnimatedImage,
  close: AnimatedClose,
  emoji: AnimatedEmoji,
  location: AnimatedLocation,
  "more-vertical": AnimatedMoreVertical,
  moon: AnimatedMoon,
  search: AnimatedSearch,
};
