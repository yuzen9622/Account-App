import { useSpring, animated } from "@react-spring/web";
import { useEffect, useRef } from "react";

const usePrevious = (value) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const AnimatedNumber = ({ number, Tag = "span" }) => {
  const previousNumber = usePrevious(number); // 獲取上次的數字

  const props = useSpring({
    from: { number: previousNumber || 0 }, // 從上一次的數值開始
    to: { number: number }, // 滾動到最新數值
    config: { duration: 500 }, // 設定動畫時間（1 秒）
  });

  const AnimatedTag = animated[Tag];

  return (
    <AnimatedTag>{props.number.to((n) => `$${Math.floor(n)}`)}</AnimatedTag>
  );
};

export default AnimatedNumber;
