import NumberFlow from "@number-flow/react";

const AnimatedNumber = ({ number = 0 }) => {
  number = parseFloat(number);
  return <NumberFlow value={number} />;
};

export default AnimatedNumber;
