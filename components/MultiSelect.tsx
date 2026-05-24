import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

interface SelectOption {
  id: string | number;
  label: string;
  value: string | number;
}

interface MultiSelectProps {
  options: SelectOption[];
  selectedValues?: (string | number)[];
  onSelect: (selected: (string | number)[]) => void;
  placeholder?: string;
  maxSelections?: number;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

const MultiSelect = ({
  options,
  selectedValues = [],
  onSelect,
  placeholder = "Select options",
  maxSelections,
  containerStyle,
  labelStyle,
}: MultiSelectProps) => {
  const [visible, setVisible] = useState(false);
  const [tempSelected, setTempSelected] =
    useState<(string | number)[]>(selectedValues);

  useEffect(() => {
    setTempSelected(selectedValues);
  }, [selectedValues]);

  const selectedLabels = useMemo(() => {
    return options
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.label);
  }, [options, selectedValues]);

  const displayText =
    selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder;

  const isSelected = (value: string | number) => {
    return tempSelected.includes(value);
  };

  const handleToggle = (value: string | number) => {
    setTempSelected((prev) => {
      const alreadySelected = prev.includes(value);

      if (alreadySelected) {
        return prev.filter((item) => item !== value);
      }

      if (maxSelections && prev.length >= maxSelections) {
        return prev;
      }

      return [...prev, value];
    });
  };

  const handleApply = () => {
    onSelect(tempSelected);
    setVisible(false);
  };

  const handleClear = () => {
    setTempSelected([]);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setVisible(true)}
        style={[styles.container, containerStyle]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.selectedText,
            selectedLabels.length === 0 && styles.placeholderText,
            labelStyle,
          ]}
        >
          {displayText}
        </Text>

        <Feather name="chevron-down" size={20} color="#8B88A8" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalWrapper}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setVisible(false)}
          />

          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{placeholder}</Text>

                {maxSelections ? (
                  <Text style={styles.modalSubtitle}>
                    {tempSelected.length}/{maxSelections} selected
                  </Text>
                ) : (
                  <Text style={styles.modalSubtitle}>
                    {tempSelected.length} selected
                  </Text>
                )}
              </View>

              <Pressable onPress={() => setVisible(false)}>
                <Feather name="x" size={24} color="#8B88A8" />
              </Pressable>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item, index) =>
                String(item.id ?? item.value ?? index)
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const selected = isSelected(item.value);

                return (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.option,
                      selected && styles.selectedOption,
                    ]}
                    onPress={() => handleToggle(item.value)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        selected && styles.selectedCheckbox,
                      ]}
                    >
                      {selected && (
                        <Feather name="check" size={15} color="#FFFFFF" />
                      )}
                    </View>

                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.selectedOptionText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            <View style={styles.footer}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleClear}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleApply}
                style={styles.applyButton}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2A2845",
    backgroundColor: "#141325",
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  selectedText: {
    flex: 1,
    color: "#EDEAF8",
    fontSize: 16,
    fontWeight: "700",
  },
  placeholderText: {
    color: "#4C4968",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modal: {
    maxHeight: "78%",
    backgroundColor: "#141325",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: "#2A2845",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  modalSubtitle: {
    color: "#8B88A8",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 12,
    gap: 10,
  },
  option: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2A2845",
    backgroundColor: "#0F0E1E",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  selectedOption: {
    borderColor: "#B954F5",
    backgroundColor: "rgba(185, 84, 245, 0.14)",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#4C4968",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCheckbox: {
    backgroundColor: "#B954F5",
    borderColor: "#B954F5",
  },
  optionText: {
    flex: 1,
    color: "#8B88A8",
    fontSize: 16,
    fontWeight: "700",
  },
  selectedOptionText: {
    color: "#FFFFFF",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  clearButton: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2A2845",
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: "#8B88A8",
    fontSize: 16,
    fontWeight: "800",
  },
  applyButton: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#B954F5",
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default MultiSelect;