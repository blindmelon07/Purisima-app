import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

interface HairstyleOption {
  id: string;
  name: string;
  image: string;
  fromPrompt: string;
  toPrompt: string;
}

const hairstyleOptions: HairstyleOption[] = [
  {
    id: '1',
    name: 'Curly Hair',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=150&h=150&fit=crop&crop=face',
    fromPrompt: 'hairstyle',
    toPrompt: 'curly hair with volume, same person'
  },
  {
    id: '2',
    name: 'Long Hair',
    image: 'https://images.unsplash.com/photo-1580618432485-c0607d04b2b5?w=150&h=150&fit=crop&crop=face',
    fromPrompt: 'hairstyle',
    toPrompt: 'long straight hair, same person'
  },
  {
    id: '3',
    name: 'Short Bob',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=150&h=150&fit=crop&crop=face',
    fromPrompt: 'hairstyle',
    toPrompt: 'short bob haircut, same person'
  },
  {
    id: '4',
    name: 'Pixie Cut',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    fromPrompt: 'hairstyle',
    toPrompt: 'pixie cut hairstyle, same person'
  },
  {
    id: '5',
    name: 'Braided Hair',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
    fromPrompt: 'hairstyle',
    toPrompt: 'braided hairstyle, same person'
  },
  {
    id: '6',
    name: 'Wavy Hair',
    image: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=150&h=150&fit=crop&crop=face',
    fromPrompt: 'hairstyle',
    toPrompt: 'wavy hair with layers, same person'
  }
];

interface HairstyleSelectorProps {
  onSelect: (fromPrompt: string, toPrompt: string) => void;
  selectedStyle?: string;
}

export default function HairstyleSelector({ onSelect, selectedStyle }: HairstyleSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Hairstyle:</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.scrollView}
        nestedScrollEnabled={true}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {hairstyleOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionContainer,
              selectedStyle === option.toPrompt && styles.selectedOption
            ]}
            onPress={() => onSelect(option.fromPrompt, option.toPrompt)}
          >
            <Image source={{ uri: option.image }} style={styles.optionImage} />
            <Text style={styles.optionName}>{option.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    maxHeight: 150, // Limit the height
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollView: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    maxHeight: 130, // Limit scroll view height
  },
  optionContainer: {
    alignItems: 'center',
    marginHorizontal: 6,
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#2a2a2a',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    width: 85,
    height: 110, // Fixed height instead of minHeight
  },
  selectedOption: {
    borderColor: '#00bfff',
    backgroundColor: '#3a3a3a',
    shadowColor: '#00bfff',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  optionImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#444',
  },
  optionName: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 13,
    flexShrink: 1,
  },
});