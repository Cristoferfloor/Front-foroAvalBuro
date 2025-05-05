import RegistrationForm from "@/src/components/forms";


export default function FormPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50">
      <div className="container mx-auto py-12 px-4">
        <RegistrationForm/>
      </div>
    </main>
  );
}