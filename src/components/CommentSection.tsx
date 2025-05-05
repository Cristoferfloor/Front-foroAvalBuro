"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Reply, ThumbsUp, MoreVertical, Lock } from 'lucide-react';
import CommentSectionv2 from './CommentSection';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  questionId?: string;
}

export default function CommentSectionV2({ questionId }: { questionId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentCount, setCommentCount] = useState(0);
  const MAX_COMMENTS = 3;

  useEffect(() => {
    // Simular carga de comentarios
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/comments/question/${questionId}`);
        const data = await response.json();
        setComments(data);
        setCommentCount(data.length);
      } catch (error) {
        console.error("Error cargando comentarios:", error);
      }
    };

    fetchComments();
  }, [questionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || commentCount >= MAX_COMMENTS) return;
    
    try {
      const response = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          questionId,
          author: "Usuario Actual"
        })
      });
      
      const result = await response.json();
      setComments([...comments, result]);
      setCommentCount(prev => prev + 1);
      setNewComment('');
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
          Discusión de la Pregunta
        </h2>
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-500">Comparte tus ideas y opiniones</p>
          <div className="flex items-center gap-2 text-sm">
            <span className={`font-medium ${commentCount >= MAX_COMMENTS ? 'text-red-500' : 'text-gray-600'}`}>
              {MAX_COMMENTS - commentCount} comentarios restantes
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
          />
        ))}
      </div>

      
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-300 to-purple-300 flex items-center justify-center text-white font-medium">
              U
            </div>
          </div>
          
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              placeholder={commentCount >= MAX_COMMENTS 
                ? "Límite de comentarios alcanzado" 
                : "Escribe tu comentario..."}
              rows={3}
              disabled={commentCount >= MAX_COMMENTS}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {commentCount}/{MAX_COMMENTS} comentarios utilizados
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
                Publicar comentario
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
const CommentItem = ({ comment, depth, maxDepth }: { 
  comment: Comment, 
  depth: number, 
  maxDepth: number 
}) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyText,
          parentId: comment.id,
          questionId: comment.questionId,
          author: "Usuario Actual"
        })
      });
      
      const result = await response.json();
      comment.replies = [...(comment.replies || []), result];
      setReplyText('');
      setShowReply(false);
    } catch (error) {
      console.error("Error posting reply:", error);
    }
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
            {comment.author.charAt(0)}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">{comment.author}</span>
              {comment.author === "Usuario Actual" && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-pink-100 text-pink-800 rounded-full">Tú</span>
              )}
            </div>
            <span className="text-xs text-gray-400">{comment.timestamp}</span>
          </div>
          
          <p className="mt-1 text-gray-800">{comment.content}</p>
          
          {depth < maxDepth && (
            <div className="flex items-center mt-2 space-x-4 text-gray-500">
              <button className="flex items-center space-x-1 hover:text-pink-500">
                <ThumbsUp size={16} />
                <span>{comment.likes}</span>
              </button>
              <button 
                className="flex items-center space-x-1 hover:text-blue-500"
                onClick={() => setShowReply(!showReply)}
              >
                <Reply size={16} />
                <span>Responder</span>
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
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-300"
            placeholder="Escribe tu respuesta..."
            rows={2}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowReply(false)}
              className="px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Enviar
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
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

