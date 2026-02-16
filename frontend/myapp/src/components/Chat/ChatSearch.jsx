import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Input } from '../Common';

const ChatSearch = ({ onSearch }) => {
  return (
    <div>
      <Input
        icon={FiSearch}
        placeholder="Search chats..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default ChatSearch;