import { FC } from "react";
import { Star, StarHalf, Star as StarOutline } from "lucide-react";

type Props = {
  rating: number;
};

const Ratings: FC<Props> = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={`star-${i}`} fill="currentColor" stroke="none" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<StarHalf key={`half-${i}`} />);
    } else {
      stars.push(<StarOutline key={`empty-${i}`} />);
    }
  }

  return <div className="flex gap-1 text-yellow-500">{stars}</div>;
};

export default Ratings;
