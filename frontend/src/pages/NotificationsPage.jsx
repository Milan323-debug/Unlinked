import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, Link as LinkIcon, MessageCircle, ThumbsUp, Trash2, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await axiosInstance.get('/notifications');
      return res.data;
    }
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: async (notificationId) => {
      await axiosInstance.put(`/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });

  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (notificationId) => {
      await axiosInstance.delete(`/notifications/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      toast.success('Notification deleted');
    }
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="text-blue-500" size={20} />;
      case 'comment':
        return <MessageCircle className="text-green-500" size={20} />;
      case 'connectionAccepted':
        return <UserCheck className="text-purple-500" size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-semibold hover:underline">
              {notification.relatedUser.name}
            </Link>{' '}
            liked your post
          </span>
        );
      case 'comment':
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-semibold hover:underline">
              {notification.relatedUser.name}
            </Link>{' '}
            commented on your post
          </span>
        );
      case 'connectionAccepted':
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-semibold hover:underline">
              {notification.relatedUser.name}
            </Link>{' '}
            accepted your connection request
          </span>
        );
      default:
        return 'New notification';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="bg-white rounded-lg shadow divide-y">
        {notifications?.length === 0 ? (
          <div className="p-4 text-center">
            <Bell size={40} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">No new notifications</p>
          </div>
        ) : (
          notifications?.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 flex items-start space-x-4 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm">{getNotificationText(notification)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {notification.relatedPost && (
                      <Link
                        to={`/post/${notification.relatedPost._id}`}
                        className="text-gray-500 hover:text-gray-700"
                        title="View post"
                      >
                        <LinkIcon size={16} />
                      </Link>
                    )}
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage; 