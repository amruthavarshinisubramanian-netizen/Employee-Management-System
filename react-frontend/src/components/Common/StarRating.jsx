import { FaStar, FaRegStar } from "react-icons/fa";

export default function StarRating({ score = 3, max = 5, size = 14, interactive = false, onChange }) {
  const currentScore = Math.max(1, Math.min(max, score || 1));

  return (
    <div className="star-rating d-inline-flex align-items-center" title={`${currentScore} of ${max} stars`}>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= currentScore;
        return (
          <span
            key={index}
            style={{ cursor: interactive ? "pointer" : "default", fontSize: `${size}px` }}
            onClick={() => interactive && onChange && onChange(starValue)}
          >
            {isFilled ? <FaStar color="#f59e0b" /> : <FaRegStar color="#cbd5e1" />}
          </span>
        );
      })}
    </div>
  );
}
