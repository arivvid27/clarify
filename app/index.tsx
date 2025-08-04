import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const navigationItems = [
  { id: 'home', icon: 'home-outline', label: 'Home' },
  { id: 'dashboard', icon: 'grid-outline', label: 'Dashboard' },
  { id: 'analytics', icon: 'analytics-outline', label: 'Analytics' },
  { id: 'settings', icon: 'settings-outline', label: 'Settings' },
  { id: 'profile', icon: 'person-outline', label: 'Profile' },
];

const sections = [
  { id: 'section1', title: 'Section 1' },
  { id: 'section2', title: 'Section 2' },
  { id: 'section3', title: 'Section 3' },
];

const Widget: React.FC<{
  title: string;
  color: string;
  size: 'small' | 'medium' | 'large';
  type: 'chart' | 'stat' | 'progress';
}> = ({ title, color, size, type }) => {
  const renderContent = () => {
    switch (type) {
      case 'stat':
        return (
          <View style={styles.widgetContent}>
            <Text style={styles.widgetTitle}>{title}</Text>
            <Text style={styles.widgetValue}>$24.8K</Text>
            <Text style={styles.widgetChange}>+12.5%</Text>
          </View>
        );
      case 'chart':
        return (
          <View style={styles.widgetContent}>
            <Text style={styles.widgetTitle}>{title}</Text>
            <View style={styles.chartPlaceholder}>
              <Ionicons name="trending-up" size={32} color="rgba(255,255,255,0.8)" />
            </View>
            <Text style={styles.widgetSubtext}>Trending upward</Text>
          </View>
        );
      case 'progress':
        return (
          <View style={styles.widgetContent}>
            <Text style={styles.widgetTitle}>{title}</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: color, width: '78%' }]} />
            </View>
            <Text style={styles.widgetValue}>78%</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const widgetSizeStyleMap: Record<'small' | 'medium' | 'large', 'widgetSmall' | 'widgetMedium' | 'widgetLarge'> = {
    small: 'widgetSmall',
    medium: 'widgetMedium',
    large: 'widgetLarge',
  };

  return (
    <View style={[styles.widget, styles[widgetSizeStyleMap[size] as 'widgetSmall' | 'widgetMedium' | 'widgetLarge']]}>
      <BlurView intensity={20} style={styles.widgetBlur}>
        <LinearGradient
          colors={[`${color}15`, `${color}08`]}
          style={styles.widgetGradient}
        >
          {renderContent()}
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const Navigation: React.FC<{
  activeItem: string;
  onItemPress: (id: string) => void;
}> = ({ activeItem, onItemPress }) => {
  return (
    <View style={styles.navigation}>
      <BlurView intensity={80} style={styles.navBlur}>
        <View style={styles.navContent}>
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
                  size={20} 
                  color={activeItem === item.id ? "#007AFF" : "rgba(255,255,255,0.8)"} 
                />
                <Text style={[
                  styles.navLabel,
                  activeItem === item.id && styles.navLabelActive,
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.userSection}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={20} color="white" />
            </View>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const SectionHeader: React.FC<{ title: string; isActive: boolean; onPress: () => void }> = ({ 
  title, 
  isActive, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.sectionTab, isActive && styles.sectionTabActive]} 
      onPress={onPress}
    >
      <Text style={[styles.sectionTitle, isActive && styles.sectionTitleActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const MainContent: React.FC<{ activeSection: string }> = ({ activeSection }) => {
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'section1':
        return (
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <Widget title="Revenue" color="#007AFF" size="medium" type="stat" />
              <Widget title="Users" color="#34C759" size="medium" type="chart" />
            </View>
            <View style={styles.gridRow}>
              <Widget title="Performance" color="#FF9500" size="small" type="progress" />
              <Widget title="Analytics" color="#FF3B30" size="large" type="chart" />
            </View>
          </View>
        );
      case 'section2':
        return (
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <Widget title="Sales" color="#5856D6" size="large" type="stat" />
              <Widget title="Growth" color="#AF52DE" size="small" type="progress" />
            </View>
            <View style={styles.gridRow}>
              <Widget title="Conversion" color="#FF2D92" size="medium" type="chart" />
              <Widget title="Traffic" color="#32ADE6" size="medium" type="stat" />
            </View>
          </View>
        );
      case 'section3':
        return (
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <Widget title="Reports" color="#30D158" size="medium" type="chart" />
              <Widget title="Metrics" color="#FF9F0A" size="medium" type="progress" />
            </View>
            <View style={styles.gridRow}>
              <Widget title="Overview" color="#007AFF" size="large" type="stat" />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
      {renderSectionContent()}
    </ScrollView>
  );
};

// Main App Component
export default function App() {
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [activeSection, setActiveSection] = useState('section2');

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#0a0a0a', '#1a1a1a', '#2a2a2a']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <Navigation
            activeItem={activeNavItem}
            onItemPress={setActiveNavItem}
          />
          
          <View style={styles.contentArea}>
            <View style={styles.sectionHeaders}>
              {sections.map((section) => (
                <SectionHeader
                  key={section.id}
                  title={section.title}
                  isActive={activeSection === section.id}
                  onPress={() => setActiveSection(section.id)}
                />
              ))}
            </View>
            
            <MainContent activeSection={activeSection} />
          </View>
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
    width: 200,
    margin: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  navBlur: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  navContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  navItems: {
    flex: 1,
    paddingTop: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
  },
  navLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    marginLeft: 12,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  userSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentArea: {
    flex: 1,
    margin: 12,
    marginLeft: 0,
  },
  sectionHeaders: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 4,
  },
  sectionTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  sectionTabActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitleActive: {
    color: 'white',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
  },
  gridContainer: {
    flex: 1,
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  widget: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  widgetSmall: {
    flex: 1,
    minHeight: 120,
  },
  widgetMedium: {
    flex: 1,
    minHeight: 160,
  },
  widgetLarge: {
    flex: 1,
    minHeight: 200,
  },
  widgetBlur: {
    flex: 1,
  },
  widgetGradient: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  widgetContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  widgetTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  widgetValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  widgetChange: {
    color: '#34C759',
    fontSize: 13,
    fontWeight: '600',
  },
  widgetSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});