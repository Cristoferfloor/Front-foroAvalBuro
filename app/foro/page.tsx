import CommentSection from "@/src/components/CommentSection";


export default function ForoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <CommentSection questionId={"1"} />
      </div>
    </main>
  );
}