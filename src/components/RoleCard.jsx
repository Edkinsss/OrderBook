// src/components/RoleCard.jsx
export default function RoleCard({ title, description }) {
  return (
    <article className="role-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}