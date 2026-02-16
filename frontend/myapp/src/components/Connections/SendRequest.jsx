import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../Common';
import connectionService from '../../services/connection';
import toast from 'react-hot-toast';

const SendRequest = ({ receiverId, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await connectionService.sendRequest(receiverId);
      toast.success('Connection request sent!');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSend} loading={loading}>
      Send Connection Request
    </Button>
  );
};

export default SendRequest;