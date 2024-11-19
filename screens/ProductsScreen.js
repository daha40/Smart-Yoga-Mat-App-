// screens/ProductsScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const products = [
  {
    id: '1',
    name: 'Smart Yoga Mat Pro',
    description: 'Advanced pressure sensors with enhanced grip surface',
    price: '$199.99',
    image: require('../assets/mat-pro.png'),
    features: [
      'Real-time pose feedback',
      'Pressure mapping',
      'Bluetooth 5.0',
      'Extended battery life',
      '6-month warranty'
    ],
    colors: ['Purple', 'Blue', 'Black'],
    stock: 'In Stock',
    rating: 4.8,
    reviewCount: 256
  },
  {
    id: '2',
    name: 'Yoga Mat Travel Case',
    description: 'Premium carrying case for your smart yoga mat',
    price: '$49.99',
    image: require('../assets/case.png'),
    features: [
      'Water resistant material',
      'Adjustable shoulder strap',
      'Multiple storage pockets',
      'Durable zippers',
      'Fits all mat sizes'
    ],
    colors: ['Black', 'Gray', 'Navy'],
    stock: 'Limited Stock',
    rating: 4.6,
    reviewCount: 128
  },
  {
    id: '3',
    name: 'Smart Mat Accessories Bundle',
    description: 'Essential accessories for your smart yoga practice',
    price: '$79.99',
    image: require('../assets/accessories.png'),
    features: [
      'Charging adapter',
      'Cleaning kit',
      'Mat alignment markers',
      'Storage bag',
      'Practice guide'
    ],
    colors: ['Standard'],
    stock: 'Pre-order',
    rating: 4.9,
    reviewCount: 89
  }
];

const features = [
  {
    id: '1',
    title: 'AI Pose Recognition',
    description: 'Real-time feedback on your yoga poses with advanced AI technology',
    icon: 'accessibility',
    new: true
  },
  {
    id: '2',
    title: 'Guided Sessions',
    description: 'Follow along with expert instructors in immersive sessions',
    icon: 'play-circle-filled',
    new: true
  },
  {
    id: '3',
    title: 'Progress Tracking',
    description: 'Monitor your improvement with detailed analytics and insights',
    icon: 'trending-up',
    new: false
  },
  {
    id: '4',
    title: 'Community Features',
    description: 'Connect with other yogis and share your journey',
    icon: 'people',
    new: true
  }
];

export default function ProductsScreen({ navigation }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={16}
          color={i <= rating ? '#FFC107' : '#ccc'}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={30} color="#6200ee" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Products</Text>
      </Animated.View>

      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.newFeaturesContainer}>
          <Text style={styles.sectionTitle}>New Features</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {features.map((feature) => (
              <View key={feature.id} style={styles.featureCard}>
                {feature.new && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
                <MaterialIcons name={feature.icon} size={40} color="#6200ee" />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductPress(product)}
            >
              <Image source={product.image} style={styles.productImage} />
              <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <View style={styles.stockBadge}>
                    <Text style={styles.stockText}>{product.stock}</Text>
                  </View>
                </View>
                
                <Text style={styles.productDescription}>{product.description}</Text>
                <View style={styles.ratingContainer}>
                  <View style={styles.stars}>{renderRatingStars(product.rating)}</View>
                  <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
                </View>
                
                <Text style={styles.productPrice}>{product.price}</Text>

                <View style={styles.colorContainer}>
                  <Text style={styles.colorTitle}>Available Colors:</Text>
                  <View style={styles.colorOptions}>
                    {product.colors.map((color, index) => (
                      <Text key={index} style={styles.colorBadge}>{color}</Text>
                    ))}
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.learnMoreButton}
                  onPress={() => handleProductPress(product)}
                >
                  <Text style={styles.learnMoreText}>View Details</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="#6200ee" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
                
                <Image source={selectedProduct.image} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                <Text style={styles.modalPrice}>{selectedProduct.price}</Text>
                
                <Text style={styles.featuresTitle}>Key Features:</Text>
                {selectedProduct.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}

                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:35
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  newFeaturesContainer: {
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
  },
  featureCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginLeft: 20,
    marginBottom: 20,
    width: 250,
    alignItems: 'center',
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#6200ee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  productsContainer: {
    padding: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 15,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  stockBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stars: {
    flexDirection: 'row',
  },
  reviewCount: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  productPrice: {
    fontSize: 20,
    color: '#6200ee',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  colorContainer: {
    marginBottom: 15,
  },
  colorTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorBadge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 12,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 5,
    marginTop: 10,
  },
  learnMoreText: {
    color: '#6200ee',
    marginRight: 5,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  modalImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 22,
    color: '#6200ee',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  buyButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});