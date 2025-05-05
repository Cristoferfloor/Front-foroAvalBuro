"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Calendar, Image as ImageIcon, MessageSquare, Reply, ThumbsUp, Lock } from "lucide-react";

interface UserData {
  name: string;
  age: number;
  profileImage?: string;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
}

export default function CommentApp() {
  const [currentView, setCurrentView] = useState<"register" | "comments">("register");
  const [userData, setUserData] = useState<UserData | null>(null);
  
  if (currentView === "register" || !userData) {
    return <RegistrationPage onRegister={(data) => {
      setUserData(data);
      setCurrentView("comments");
    }} />;
  }

  return <CommentSectionV2 userData={userData} />;
}

function RegistrationPage({ onRegister }: { onRegister: (data: UserData) => void }) {
  const [formData, setFormData] = useState<UserData>({
    name: "",
    age: 0,
    profileImage: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setErrors(prev => ({...prev, profileImage: "Only image files are allowed"}));
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({...prev, profileImage: "Image must not exceed 2MB"}));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({...prev, profileImage: event.target?.result as string}));
      setErrors(prev => ({...prev, profileImage: ""}));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.age < 13 || formData.age > 100) newErrors.age = "Age must be between 13 and 100 years";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      onRegister(formData);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Register to comment
          </h2>

          {errors.form && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <span className="px-3 bg-gray-100">
                  <User className="w-5 h-5 text-gray-500" />
                </span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 focus:outline-none text-black"
                  placeholder="E.g. John Doe"
                />
              </div>
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Age</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <span className="px-3 bg-gray-100">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </span>
                <input
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => setFormData({...formData, age: Number(e.target.value) || 0})}
                  className="w-full p-2 focus:outline-none text-black"
                  placeholder="E.g. 25"
                  min="13"
                  max="100"
                />
              </div>
              {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Profile photo (optional)</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm text-white bg-purple-500 rounded-md hover:bg-purple-600 transition-colors"
                >
                  {formData.profileImage ? "Change image" : "Select image"}
                </button>
                {formData.profileImage && (
                  <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-purple-200">
                    <img
                      src={formData.profileImage}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
              {errors.profileImage && (
                <p className="text-sm text-red-500 mt-1">{errors.profileImage}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-6 text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-md shadow-md hover:shadow-lg transition-all disabled:opacity-70"
            >
              {isSubmitting ? "Registering..." : "Register and view comments"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function CommentSectionV2({ userData }: { userData: UserData }) {
  const [comments, setComments] = useState<Comment[]>([
    // Initial comments can be added here
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [commentCount, setCommentCount] = useState(0);
  const MAX_COMMENTS = 5;

  const formatTimestamp = () => {
    return `a few moments ago`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || commentCount >= MAX_COMMENTS) return;
    
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: userData.name,
      avatar: userData.name.charAt(0).toUpperCase(),
      content: newComment,
      timestamp: formatTimestamp(),
      likes: 0,
      replies: [],
    };
    
    setComments([...comments, newCommentObj]);
    setCommentCount(prev => prev + 1);
    setNewComment('');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
          Question Discussion
        </h2>
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-500">Share your ideas and opinions</p>
          <div className="flex items-center gap-2 text-sm">
            <span className={`font-medium ${commentCount >= MAX_COMMENTS ? 'text-red-500' : 'text-gray-600'}`}>
              {MAX_COMMENTS - commentCount} comments remaining
            </span>
            {commentCount >= MAX_COMMENTS && <Lock className="w-4 h-4 text-red-500" />}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            depth={0} 
            maxDepth={2} 
            setComments={setComments}
            currentUser={userData.name}
          />
        ))}
      </div>

      
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            {userData.profileImage ? (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={userData.profileImage}
                  alt="Avatar"
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-300 to-purple-300 flex items-center justify-center text-white font-medium">
                {userData.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent text-black"
              placeholder={commentCount >= MAX_COMMENTS 
                ? "Comment limit reached" 
                : "Write your comment..."}
              rows={3}
              disabled={commentCount >= MAX_COMMENTS}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {commentCount}/{MAX_COMMENTS} comments used
              </span>
              <button
                type="submit"
                disabled={!newComment.trim() || commentCount >= MAX_COMMENTS}
                className={`px-4 py-2 text-white rounded-lg transition-all ${
                  commentCount >= MAX_COMMENTS || !newComment.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-md'
                }`}
              >
                Post comment
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

const CommentItem = ({ 
  comment, 
  depth, 
  maxDepth,
  setComments,
  currentUser
}: { 
  comment: Comment, 
  depth: number, 
  maxDepth: number,
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
  currentUser: string
}) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const formatTimestamp = () => {
    return `a few moments ago`;
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    const newReply: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      avatar: currentUser.charAt(0).toUpperCase(),
      content: replyText,
      timestamp: formatTimestamp(),
      likes: 0,
      replies: [],
    };

    setComments(prev => prev.map(c => {
      if (c.id === comment.id) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply]
        };
      }
      return c;
    }));

    setReplyText('');
    setShowReply(false);
  };

  const handleLike = () => {
    setComments(prev => prev.map(c => {
      if (c.id === comment.id) {
        return {
          ...c,
          likes: c.likes + 1
        };
      }
      
      if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: c.replies.map(r => {
            if (r.id === comment.id) {
              return {
                ...r,
                likes: r.likes + 1
              };
            }
            return r;
          })
        };
      }
      
      return c;
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-b pb-4 last:border-0 pl-${depth * 4}`}
      style={{ marginLeft: `${depth * 1}rem` }}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 flex items-center justify-center text-white">
            {comment.avatar}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-black">{comment.author}</span>
              {comment.author === currentUser && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-amber-200 text-pink-800 rounded-full">You</span>
              )}
            </div>
            <span className="text-xs text-gray-500">{comment.timestamp}</span>
          </div>
          
          <p className="mt-1 text-black">{comment.content}</p>
          
          {depth < maxDepth && (
            <div className="flex items-center mt-2 space-x-4 text-gray-500">
              <button 
                className="flex items-center space-x-1 hover:text-pink-500"
                onClick={handleLike}
              >
                <ThumbsUp size={16} />
                <span>{comment.likes}</span>
              </button>
              <button 
                className="flex items-center space-x-1 hover:text-blue-500"
                onClick={() => setShowReply(!showReply)}
              >
                <Reply size={16} />
                <span>Reply</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showReply && depth < maxDepth && (
        <form onSubmit={handleReplySubmit} className="mt-4 ml-12">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-300 text-black"
            placeholder="Write your reply..."
            rows={2}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowReply(false)}
              className="px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              depth={depth + 1} 
              maxDepth={maxDepth}
              setComments={setComments}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};