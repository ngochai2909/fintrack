'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

/**
 * PROFILE & SETTINGS PAGE
 * 
 * Features:
 * - Display user profile information
 * - Update profile (firstName, lastName, avatar)
 * - Change password
 * - Account information display
 */
export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  // Fetch user profile
  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
  });

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    avatar: user?.avatar || '',
  });

  const [profileError, setProfileError] = useState('');

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => authService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert('Cập nhật thông tin thành công!');
    },
    onError: (err: any) => {
      setProfileError(err.response?.data?.message || 'Không thể cập nhật thông tin');
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => authService.changePassword(data),
    onSuccess: () => {
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordError('');
    },
    onError: (err: any) => {
      setPasswordError(err.response?.data?.message || 'Không thể đổi mật khẩu');
      setPasswordSuccess('');
    },
  });

  // Pre-fill profile data when user loads
  useState(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        avatar: user.avatar || '',
      });
    }
  });

  // Handle profile form submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    
    updateProfileMutation.mutate(profileData);
  };

  // Handle password form submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!passwordData.currentPassword) {
      setPasswordError('Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            👤 Tài khoản & Cài đặt
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin cá nhân và cài đặt tài khoản
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'profile'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📋 Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'password'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🔒 Đổi mật khẩu
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'profile' ? (
              /* Profile Tab */
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Account Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-800 mb-2">Thông tin tài khoản</h3>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p><span className="font-medium">Email:</span> {user?.email}</p>
                    <p><span className="font-medium">Vai trò:</span> {user?.role}</p>
                    <p><span className="font-medium">Trạng thái:</span> {user?.isActive ? '✅ Hoạt động' : '❌ Bị khóa'}</p>
                    <p><span className="font-medium">Tham gia:</span> {new Date(user?.createdAt || '').toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập họ của bạn"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên của bạn"
                  />
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={profileData.avatar}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, avatar: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Nhập URL ảnh đại diện (hoặc để trống)
                  </p>
                </div>

                {/* Error */}
                {profileError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    <span>{profileError}</span>
                  </div>
                )}

                {/* Button */}
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                >
                  {updateProfileMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Đang cập nhật...
                    </span>
                  ) : (
                    '✅ Cập nhật thông tin'
                  )}
                </button>
              </form>
            ) : (
              /* Password Tab */
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mật khẩu hiện tại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>

                {/* Error */}
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    <span>{passwordError}</span>
                  </div>
                )}

                {/* Success */}
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                {/* Button */}
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                >
                  {changePasswordMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Đang đổi mật khẩu...
                    </span>
                  ) : (
                    '🔒 Đổi mật khẩu'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
