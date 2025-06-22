import { API_BASE_URL } from '@/config/env'; // Thay đổi import từ @env sang @/config/env
import { RootStackParamList, TextChatScreenNavigationProp } from '@/navigations/types';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import styles from './styles';

type Props = {
  navigation: TextChatScreenNavigationProp;
  route: RouteProp<RootStackParamList, 'TextChat'>;
};

type ChatItem = {
  id: string;
  prompt: string;
  response: string;
};

const TextChatScreen: React.FC<Props> = ({ navigation }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      console.log('🔄 Đang tải lịch sử chat từ:', `${API_BASE_URL}/text-to-text`);
      
      const response = await axios.get(`${API_BASE_URL}/text-to-text`);
      setHistory(response.data);
      
      console.log('✅ Tải lịch sử thành công:', response.data.length, 'tin nhắn');
    } catch (error) {
      console.error('❌ Lỗi khi tải lịch sử:', error);
      Alert.alert('Lỗi', 'Không thể tải lịch sử chat. Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tin nhắn trước khi gửi.');
      return;
    }

    const currentInput = input.trim();
    
    try {
      setSending(true);
      setInput(''); // Xóa input ngay lập tức để UX tốt hơn
      
      console.log('📤 Đang gửi tin nhắn:', currentInput);
      
      const response = await axios.post(`${API_BASE_URL}/text-to-text`, { 
        prompt: currentInput 
      }, {
        timeout: 30000, // Timeout 30 giây
      });

      console.log('✅ Nhận được phản hồi từ AI');

      const newChatItem: ChatItem = {
        id: response.data.id,
        prompt: currentInput,
        response: response.data.result
      };

      setHistory(prevHistory => [newChatItem, ...prevHistory]);
      
    } catch (error) {
      console.error('❌ Lỗi khi gửi tin nhắn:', error);
      setInput(currentInput); // Khôi phục input nếu có lỗi
      Alert.alert(
        'Lỗi', 
        'Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối mạng và thử lại.'
      );
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('🗑️ Đang xóa tin nhắn:', id);
      
      await axios.delete(`${API_BASE_URL}/text-to-text/${id}`);
      setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
      
      console.log('✅ Xóa tin nhắn thành công');
      Alert.alert('Thành công', 'Đã xóa tin nhắn khỏi lịch sử.');
      
    } catch (error) {
      console.error('❌ Lỗi khi xóa tin nhắn:', error);
      Alert.alert('Lỗi', 'Không thể xóa tin nhắn. Vui lòng thử lại.');
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa tin nhắn này khỏi lịch sử?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => handleDelete(id) }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.screen} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>AI Text Chat</Text>
      
      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Nhập tin nhắn của bạn..."
          placeholderTextColor="#999"
          multiline
          maxLength={1000}
          editable={!sending}
        />
        <Button 
          title={sending ? "Đang gửi..." : "Gửi"} 
          onPress={handleSend} 
          color="#007AFF"
          disabled={sending || !input.trim()}
        />
      </View>

      {sending && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>AI đang suy nghĩ...</Text>
        </View>
      )}
      
      {/* Chat History */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải lịch sử chat...</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <View style={styles.promptContainer}>
                <Text style={styles.promptLabel}>Bạn:</Text>
                <Text style={styles.prompt}>{item.prompt}</Text>
              </View>
              
              <View style={styles.responseContainer}>
                <Text style={styles.responseLabel}>AI:</Text>
                <Text style={styles.response}>{item.response}</Text>
              </View>
              
              <Button 
                title="Xóa" 
                onPress={() => confirmDelete(item.id)} 
                color="#FF3B30" 
              />
            </View>
          )}
          style={styles.historyList}
          refreshing={loading}
          onRefresh={fetchHistory}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Chưa có cuộc trò chuyện nào.{'\n'}
                Hãy gửi tin nhắn đầu tiên!
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default TextChatScreen;