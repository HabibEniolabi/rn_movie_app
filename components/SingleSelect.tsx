// src/components/SingleSelect.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle
} from 'react-native';

interface SelectOption {
  id: string;
  label: string;
  value: any;
}

interface SingleSelectProps {
  options: SelectOption[];
  selectedValue?: string | number;
  onSelect: (option: SelectOption) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
  containerStyle,
  labelStyle
}) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel = options.find(opt => opt.id === selectedValue)?.label || placeholder;

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.buttonText, labelStyle]}>
          {selectedLabel}
        </Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modal}>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedValue === item.id && styles.selectedOptionText
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#141325', // Dark navy background
    borderRadius: 18, // Rounded pill shape
    borderWidth: 1,
    borderColor: '#2A2845' // Subtle border color
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF', // White text
    flex: 1
  },
  arrow: {
    fontSize: 20,
    color: '#7B8BA8',
    marginLeft: 10
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modal: {
    backgroundColor: '#141325',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingVertical: 15
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2A3F'
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF'
  },
  selectedOptionText: {
    color: '#5B9EFF',
    fontWeight: 'bold'
  }
});