// import React from 'react';
// import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, Image } from 'react-native';

// interface AvatarProps {
//     letter?: string;
//     imageUri?: string;
//     size?: number;
//     backgroundColor?: string;
//     style?: StyleProp<ViewStyle>;
// }

// const Avatar: React.FC<AvatarProps> = ({
//     letter,
//     imageUri,
//     size = 32,
//     backgroundColor = '#6366F1',
//     style
// }) => {

//     const renderContent = () => {
//         if (imageUri) {
//             return (
//                 <Image
//                     source={{ uri: imageUri }}
//                     style={[
//                         styles.avatarImage,
//                         {
//                             width: size,
//                             height: size,
//                             borderRadius: size / 2,
//                         }
//                     ]}
//                     onError={() => {
//                         console.log('Failed to load avatar image');
//                     }}
//                 />
//             );
//         }

//         return (
//             <Text style={[styles.avatarText, { fontSize: size * 0.375 }]}>
//                 {letter || '?'}
//             </Text>
//         );
//     };

//     return (
//         <View
//             style={[
//                 styles.avatar,
//                 {
//                     width: size,
//                     height: size,
//                     borderRadius: size / 2,
//                     backgroundColor: imageUri ? 'transparent' : backgroundColor,
//                 },
//                 style,
//             ]}
//         >
//             {renderContent()}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     avatar: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         overflow: 'hidden',
//     } as ViewStyle,
//     avatarText: {
//         color: '#FFF',
//         fontWeight: 'bold',
//     } as TextStyle,
//     avatarImage: {
//         resizeMode: 'cover',
//     } as any,
// });

// export default Avatar;
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
    Image,
    ImageStyle,
} from 'react-native';

interface AvatarProps {
    letter?: string;
    imageUri?: string;
    size?: number;
    backgroundColor?: string;
    style?: StyleProp<ViewStyle>;
}

const Avatar: React.FC<AvatarProps> = ({
    letter,
    imageUri,
    size = 32,
    backgroundColor = '#6366F1',
    style,
}) => {
    const [imageFailed, setImageFailed] = useState(false);

    const showImage = imageUri && !imageFailed;

    return (
        <View
            style={[
                styles.avatar,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: showImage ? 'transparent' : backgroundColor,
                },
                style,
            ]}
        >
            {showImage ? (
                <Image
                    source={{ uri: imageUri }}
                    style={[
                        styles.avatarImage,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                        },
                    ]}
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>
                    {letter || '?'}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    } as ViewStyle,
    avatarText: {
        color: '#FFF',
        fontWeight: 'bold',
    } as TextStyle,
    avatarImage: {
        resizeMode: 'cover',
    } as ImageStyle,
});

export default Avatar;


// import React from 'react';
// import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

// interface AvatarProps {
//     letter: string;
//     size?: number;
//     backgroundColor?: string;
//     style?: StyleProp<ViewStyle>;
// }

// const Avatar: React.FC<AvatarProps> = ({ letter, size = 32, backgroundColor, style }) => (
//     <View
//         style={[
//             styles.avatar,
//             {
//                 width: size,
//                 height: size,
//                 borderRadius: size / 2,
//                 backgroundColor,
//             },
//             style,
//         ]}
//     >
//         <Text style={[styles.avatarText, { fontSize: size * 0.375 }]}>
//             {letter}
//         </Text>
//     </View>
// );

// const styles = StyleSheet.create({
//     avatar: {
//         alignItems: 'center',
//         justifyContent: 'center',
//     } as ViewStyle,
//     avatarText: {
//         color: '#FFF',
//         fontWeight: 'bold',
//     } as TextStyle,
// });

// export default Avatar;
