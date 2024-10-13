import { useSession } from "next-auth/react";

const UserProfile = () => {
  const { data: session } = useSession();

  if (!session) {
    return <div>未登入</div>;
  }

  return (
    <div>
      <p>用戶 ID: {session.user.id}</p>
      <p>名稱: {session.user.name}</p>
      <p>電子郵件: {session.user.email}</p>
      {session.user.image && (
        <img
          alt="用戶頭像"
          src={session.user.image}
        />
      )}
    </div>
  );
};

export default UserProfile;
