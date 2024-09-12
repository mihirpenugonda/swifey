import React, { createRef, useState } from "react";

import {
  StyleSheet,
  View,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DynamicallySelectedPickerListItem from "./pickerItem";
import type { ListItem, PickerProps } from "./types";

const itemDefaults: Array<ListItem> = [
  {
    label: "No items",
    value: 0,
    itemColor: "red",
  },
];

export default function DynamicallySelectedPicker<ItemT extends ListItem>({
  items = itemDefaults as unknown as Array<ItemT>,
  onScroll,
  onScrollBeginDrag,
  onScrollEndDrag,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  renderItem = DynamicallySelectedPickerListItem,
  width = 300,
  height = 300,
  horizontal = false,
  initialSelectedIndex = 0,
  transparentItemRows = 2,
  allItemsColor = "#000",
  fontFamily = "Arial",
  fontSize,
  selectedItemBorderColor = "#313131",
  renderGradientOverlay = false,
  topGradientColors = [
    "rgba(49, 49, 49, 0.1)",
    "rgba(49, 49, 49, 0.06)",
    "rgba(49, 49, 49, 0.03)",
    "rgba(49, 49, 49, 0.0)",
  ],
  bottomGradientColors = [
    "rgba(49, 49, 49, 0.0)",
    "rgba(49, 49, 49, 0.03)",
    "rgba(49, 49, 49, 0.06)",
    "rgba(49, 49, 49, 0.1)",
  ],
}: PickerProps<ItemT>) {
  // work out the size of each 'slice' so it fits in the size of the view
  const itemSize = Math.ceil(
    (horizontal ? width : height) / (transparentItemRows * 2 + 1)
  );

  const [itemIndex, setItemIndex] = useState<number>(initialSelectedIndex);

  // create a reference to the scroll view so we can control it's fine scroll
  const scrollViewRef = createRef<ScrollView>();

  const scrollToInitialPosition = () => {
    scrollViewRef.current?.scrollTo(
      horizontal
        ? { x: itemSize * initialSelectedIndex, animated: false }
        : { y: itemSize * initialSelectedIndex, animated: false }
    );
  };

  const gradientSize = Math.round(
    ((horizontal ? width : height) - itemSize) / 2
  );

  function fakeItems(n = 3): Array<ItemT> {
    const itemsArr = [];
    for (let i = 0; i < n; i++) {
      itemsArr[i] = {
        value: -1,
        label: "",
        fakeItem: true,
      };
    }
    return itemsArr as Array<ItemT>;
  }

  function allItemsLength() {
    return extendedItems().length - transparentItemRows * 2;
  }

  function onScrollListener(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (onScroll != null) {
      const index = getItemIndex(event);
      if (itemIndex !== index && index >= 0 && index < allItemsLength()) {
        setItemIndex(index);
        onScroll({ index });
      }
    }
  }

  function onMomentumScrollBeginListener(
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    if (onMomentumScrollBegin != null) {
      const index = getItemIndex(event);
      if (index >= 0 && index < allItemsLength()) {
        setItemIndex(index);
        onMomentumScrollBegin({ index });
      }
    }
  }

  function onMomentumScrollEndListener(
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    if (onMomentumScrollEnd != null) {
      const index = getItemIndex(event);

      if (index >= 0 && index < allItemsLength()) {
        setItemIndex(index);
        onMomentumScrollEnd({ index });
      }
    }
  }

  function onScrollBeginDragListener(
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    if (onScrollBeginDrag != null) {
      const index = getItemIndex(event);

      if (index >= 0 && index < allItemsLength()) {
        setItemIndex(index);
        onScrollBeginDrag({ index });
      }
    }
  }

  function onScrollEndDragListener(
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    if (onScrollEndDrag != null) {
      const index = getItemIndex(event);

      if (index >= 0 && index < allItemsLength()) {
        setItemIndex(index);
        onScrollEndDrag({ index });
      }
    }
  }

  function getItemIndex(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offset = horizontal
      ? event.nativeEvent.contentOffset.x
      : event.nativeEvent.contentOffset.y;

    return Math.round(offset / itemSize);
  }

  function extendedItems(): Array<ItemT> {
    return [
      ...fakeItems(transparentItemRows),
      ...items,
      ...fakeItems(transparentItemRows),
    ];
  }

  const PickerListItem = renderItem;

  return (
    <View style={{ height, width }}>
      <LinearGradient
        colors={topGradientColors}
        style={[
          styles.gradientVerticalWrapper,
          {
            top: 0,
            height: gradientSize,
          },
        ]}
        pointerEvents="none"
      />

      <View
        style={[
          styles.gradientVerticalWrapper,
          {
            top: gradientSize,
            height: itemSize,
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
          },
        ]}
        pointerEvents="none"
      />

      <LinearGradient
        colors={bottomGradientColors}
        style={[
          styles.gradientVerticalWrapper,
          {
            bottom: 0,
            height: gradientSize,
          },
        ]}
        pointerEvents="none"
      />

      <ScrollView
        ref={scrollViewRef}
        onLayout={scrollToInitialPosition}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollBegin={onMomentumScrollBeginListener}
        onMomentumScrollEnd={onMomentumScrollEndListener}
        onScrollBeginDrag={onScrollBeginDragListener}
        onScrollEndDrag={onScrollEndDragListener}
        onScroll={onScrollListener}
        scrollEventThrottle={20}
        horizontal={horizontal}
        snapToInterval={itemSize}
      >
        {extendedItems().map((item: ItemT, index) => {
          return (
            <PickerListItem
              key={index}
              item={item}
              fakeItem={item.fakeItem ? item.fakeItem : false}
              isSelected={itemIndex + transparentItemRows === index}
              allItemsColor={allItemsColor}
              fontSize={fontSize ? fontSize : itemSize / 2}
              fontFamily={fontFamily}
              horizontal={horizontal}
              height={itemSize}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  gradientVerticalWrapper: {
    position: "absolute",
    width: "100%",
  },
  gradientHorizontalWrapper: {
    position: "absolute",
    height: "100%",
  },
});
