import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, List, ListItem, ListItemAvatar, ListItemText, Avatar, Badge, IconButton, Paper, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import { getSocket } from '../utils/socket';
import { fetchAllUsers } from '../utils/auth';

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [unseenMessages, setUnseenMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([
    { senderId: 1, content: 'Lorem Ipsum is placeholder text commonly used in..', time: '4:20 PM' },
    { senderId: 2, content: 'Lorem Ipsum is placeholder text commonly used in the graphic, print, and publishing.', time: '5:00 PM' },
    { senderId: 1, content: 'Lorem Ipsum is placeholder text commonly used in the graphic, print, and publishing.', time: '5:10 PM' },
  ]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in first.');
        return;
      }

      try {
        const response = await fetchAllUsers(token);
        const { users, unseenMessage } = response;
        setUsers(users);
        setUnseenMessages(unseenMessage);
      } catch (error) {
        setMessages([]);
        console.error('Failed to fetch users:', error);
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const socket = getSocket();
      if (socket) {
        console.log("Socket connected:", socket.id);

        socket.on("getOnlineUsers", (users) => {
          console.log("Online Users:", users);
          setOnlineUsers(users);
        });

        // Request online users manually (optional)
        socket.emit("requestOnlineUsers");

        clearInterval(interval); // Stop checking once socket is available
      }
    }, 500); // Check every 0.5 seconds until socket is ready

    return () => {
      const socket = getSocket();
      if (socket) socket.off("getOnlineUsers");
      clearInterval(interval);
    };
  }, []);

  const handleSendMessage = () => {
    const socket = getSocket();
    if (messageInput.trim() && selectedUserId) {
      socket.emit('sendMessage', {
        content: messageInput,
        receiver_id: selectedUserId,
      });
      setMessageInput('');
    }
  };

  console.log('Selected User ID:', selectedUserId, users);
  const selectedUser = users.find(user => user._id === selectedUserId);
  console.log('Selected User ID:', selectedUser,  selectedUserId, users);

  return (
    <Box sx={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <Box sx={{ width: 300, background: '#141416', color: '#fff', p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="span" sx={{ fontWeight: 'bold', color: '#b57bff' }}>💬 QuickChat</Box>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, backgroundColor: '#2b2b38', px: 2, borderRadius: 2 }}>
          <SearchIcon sx={{ color: 'gray' }} />
          <TextField
            placeholder="Search here..."
            variant="standard"
            fullWidth
            InputProps={{ disableUnderline: true, style: { color: 'white' } }}
          />
        </Box>

        <List>
          {users.map(user => (
            <ListItem
              key={user._id}
              onClick={() => setSelectedUserId(user._id)}
              sx={{
                borderRadius: 2,
                backgroundColor: selectedUserId === user._id ? '#2f2f40' : 'transparent',
                mb: 1,
                cursor: 'pointer'
              }}
            >
              <ListItemAvatar>
                <Badge
                  variant="dot"
                  color="success"
                  invisible={!onlineUsers.includes(user._id)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  <Avatar alt={user.name} src={user.avatar} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ color: '#fff' }}>{user.name}</Typography>}
                secondary={<Typography sx={{ color: onlineUsers.includes(user._id) ? 'limegreen' : 'gray' }}>{onlineUsers.includes(user._id) ? 'Online' : 'Offline'}</Typography>}
              />
              {unseenMessages[user.id] > 0 && (
                <Badge badgeContent={unseenMessages[user._id]} color="secondary" />
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Chat Window */}
      <Box sx={{ flexGrow: 1, background: 'linear-gradient(135deg, #1f1f2b, #2f2f40)', p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {selectedUser && <Avatar src={selectedUser.avatar} sx={{ mr: 2 }} />}
          <Typography variant="h6" sx={{ color: '#fff' }}>{selectedUser?.name}</Typography>
          {selectedUser && onlineUsers.includes(selectedUser.id) && <Typography sx={{ color: 'limegreen', ml: 1 }}>●</Typography>}
        </Box>

        <Divider sx={{ background: '#333' }} />

        <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
          {messages && messages.map((msg, index) => (
            <Box key={index} sx={{ textAlign: msg.senderId === 1 ? 'right' : 'left', mb: 2 }}>
              <Paper
                sx={{
                  display: 'inline-block',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: msg.senderId === 1 ? '#6e56cf' : '#3a3a4f',
                  color: '#fff'
                }}
              >
                <Typography>{msg.content}</Typography>
              </Paper>
              <Typography variant="caption" color="gray" sx={{ mt: 0.5 }}>{msg.time}</Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ background: '#333' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, backgroundColor: '#2b2b38', px: 2, borderRadius: 2 }}>
          <TextField
            fullWidth
            placeholder="Send a message"
            variant="standard"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            InputProps={{ disableUnderline: true, style: { color: 'white' } }}
          />
          <IconButton onClick={handleSendMessage}>
            <SendIcon sx={{ color: '#b57bff' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;