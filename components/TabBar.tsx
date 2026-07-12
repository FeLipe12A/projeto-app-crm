import { Feather, Foundation } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useLinkBuilder } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();
  const icon = {
    home: (props: any) => (<Foundation name="home" size={24} {...props} />),
    clientes: (props: any) => (<Feather name="users" size={24} {...props} />),
    orcamentos: (props: any) => (<Feather name="file-text" size={24} {...props} />),
    perfil: (props: any) => (<Feather name="user" size={24} {...props} />),
  }

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.name,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.name,
          });
        };

        const IconComponent = icon[route.name as keyof typeof icon];

        return (
          <PlatformPressable
            key={route.name}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabbarItem, {backgroundColor: isFocused ? '#B35D33' : 'transparent'}]}
          >
            {IconComponent && IconComponent({ 
                color: isFocused ? '#FFFCFF' : '#55433B',
            })}
            <Text
              style={[
                styles.tabbarItemText,
                { color: isFocused ? '#FFFCFF' : '#55433B' },
              ]}>
                {typeof label === 'string' ? label : route.name}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    tabbar: {
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        elevation: 6,
        backgroundColor: "#FFFCFF",
        width: "100%",
        paddingTop: 12,
        paddingBottom: 25,
        paddingHorizontal: 20,
        gap: 24.9,
    },
    tabbarItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        paddingVertical: 5,
    },
    tabbarItemText: {
        fontSize: 12, 
        lineHeight: 14, 
        fontWeight: '500'
    }
})