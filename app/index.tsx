import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Navigation items
const navigationItems = [
  { id: 'dashboard', icon: 'grid-outline', label: 'Dashboard' },
  { id: 'analytics', icon: 'analytics-outline', label: 'Analytics' },
  { id: 'settings', icon: 'settings-outline', label: 'Settings' },
  { id: 'profile', icon: 'person-outline', label: 'Profile' },
];

// Sample widgets
interface Widget {
  id: string;
  title: string;
  type: 'chart' | 'stat' | 'progress';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const initialWidgets: Widget[] = [
  {
    id: '1',
    title: 'Revenue',
    type: 'stat',
    x: 20,
    y: 20,
    width: 160,
    height: 120,
    color: '#007AFF',
  },
  {
    id: '2',
    title: 'Users',
    type: 'chart',
    x: 200,
    y: 20,
    width: 160,
    height: 120,
    color: '#34C759',
  },
  {
    id: '3',
    title: 'Performance',
    type: 'progress',
    x: 20,
    y: 160,
    width: 160,
    height: 120,
    color: '#FF9500',
  },
  {
    id: '4',
    title: 'Conversion',
    type: 'stat',
    x: 200,
    y: 160,
    width: 160,
    height: 120,
    color: '#FF3B30',
  },
];

// Widget Component
const DraggableWidget: React.FC<{
  widget: Widget;
  onDrag: (id: string, x: number, y: number) => void;
}> = ({ widget, onDrag }) => {
  const pan = useRef(new Animated.ValueXY({ x: widget.x, y: widget.y })).current;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x instanceof Animated.Value ? (pan.x as any).getValue() : 0,
        y: pan.y instanceof Animated.Value ? (pan.y as any).getValue() : 0,
      });
      pan.setValue({ x: 0, y: 0 });
      
      Animated.spring(scale, {
        toValue: 1.05,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (evt, gestureState) => {
      pan.flattenOffset();
      
      const currentX = pan.x instanceof Animated.Value ? (pan.x as any).getValue() : 0;
      const currentY = pan.y instanceof Animated.Value ? (pan.y as any).getValue() : 0;
      const newX = Math.max(0, Math.min(screenWidth - widget.width - 100, currentX));
      const newY = Math.max(0, Math.min(screenHeight - widget.height - 200, currentY));
      
      pan.setValue({ x: newX, y: newY });
      onDrag(widget.id, newX, newY);
      
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    },
  });

  React.useEffect(() => {
    pan.setValue({ x: widget.x, y: widget.y });
  }, [widget.x, widget.y]);

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'stat':
        return (
          <View style={styles.widgetContent}>
            <Text style={styles.widgetValue}>$24.8K</Text>
            <Text style={styles.widgetLabel}>{widget.title}</Text>
            <Text style={styles.widgetChange}>+12.5%</Text>
          </View>
        );
      case 'chart':
        return (
          <View style={styles.widgetContent}>
            <Text style={styles.widgetLabel}>{widget.title}</Text>
            <View style={styles.chartPlaceholder}>
              <Ionicons name="trending-up" size={24} color="white" />
            </View>
            <Text style={styles.widgetValue}>1,847</Text>
          </View>
        );
      case 'progress':
        return (
          <View style={styles.widgetContent}>
            <Text style={styles.widgetLabel}>{widget.title}</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: widget.color }]} />
            </View>
            <Text style={styles.widgetValue}>78%</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.widget,
        {
          width: widget.width,
          height: widget.height,
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <BlurView intensity={80} style={styles.widgetBlur}>
        <LinearGradient
          colors={[`${widget.color}40`, `${widget.color}20`]}
          style={styles.widgetGradient}
        >
          {renderWidgetContent()}
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
};

// Navigation Component
const Navigation: React.FC<{
  isExpanded: boolean;
  onToggle: () => void;
  activeItem: string;
  onItemPress: (id: string) => void;
}> = ({ isExpanded, onToggle, activeItem, onItemPress }) => {
  const navAnimation = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(navAnimation, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const navWidth = navAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [70, 200],
  });

  return (
    <Animated.View style={[styles.navigation, { width: navWidth }]}>
      <BlurView intensity={100} style={styles.navBlur}>
        <View style={styles.navContent}>
          <TouchableOpacity style={styles.navToggle} onPress={onToggle}>
            <Ionicons 
              name={isExpanded ? "chevron-back" : "menu"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
          
          <View style={styles.navItems}>
            {navigationItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navItem,
                  activeItem === item.id && styles.navItemActive,
                ]}
                onPress={() => onItemPress(item.id)}
              >
                <Ionicons 
                  name={item.icon as any} 
                  size={24} 
                  color={activeItem === item.id ? "#007AFF" : "white"} 
                />
                {isExpanded && (
                  <Animated.View
                    style={{
                      opacity: navAnimation,
                      transform: [
                        {
                          translateX: navAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-20, 0],
                          }),
                        },
                      ],
                    }}
                  >
                    <Text style={[
                      styles.navLabel,
                      activeItem === item.id && styles.navLabelActive,
                    ]}>
                      {item.label}
                    </Text>
                  </Animated.View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
};

// Main App Component
export default function App() {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [navExpanded, setNavExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const mainContentMargin = useRef(new Animated.Value(70)).current;

  React.useEffect(() => {
    Animated.timing(mainContentMargin, {
      toValue: navExpanded ? 220 : 90,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [navExpanded]);

  const handleWidgetDrag = (id: string, x: number, y: number) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, x, y } : widget
    ));
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#2d2d2d']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <Navigation
            isExpanded={navExpanded}
            onToggle={() => setNavExpanded(!navExpanded)}
            activeItem={activeNavItem}
            onItemPress={setActiveNavItem}
          />
          
          <Animated.View style={[styles.mainContent, { marginLeft: mainContentMargin }]}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Dashboard</Text>
              <Text style={styles.headerSubtitle}>Welcome back! Here's your overview</Text>
            </View>
            
            <View style={styles.widgetContainer}>
              {widgets.map((widget) => (
                <DraggableWidget
                  key={widget.id}
                  widget={widget}
                  onDrag={handleWidgetDrag}
                />
              ))}
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    flexDirection: 'row',
  },
  navigation: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 60 : 40,
    bottom: 20,
    borderRadius: 25,
    overflow: 'hidden',
    zIndex: 1000,
  },
  navBlur: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  navContent: {
    flex: 1,
    padding: 20,
  },
  navToggle: {
    padding: 10,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  navItems: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  navItemActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
  navLabel: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#007AFF',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  widgetContainer: {
    flex: 1,
    position: 'relative',
  },
  widget: {
    position: 'absolute',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  widgetBlur: {
    flex: 1,
    borderRadius: 16,
  },
  widgetGradient: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  widgetContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  widgetLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  widgetValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  widgetChange: {
    color: '#34C759',
    fontSize: 12,
    fontWeight: '600',
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '78%',
    borderRadius: 4,
  },
});