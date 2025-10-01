import { LayoutBox } from './LayoutBox.jsx';
import instagram from "../assets/instagram.png";
import X from "../assets/X.png";
import ln from "../assets/ln.png";

export default function Footer() {
  return (
    <LayoutBox className="h-32 mt-8">
        <LayoutBox className="h-32 mt-8">
            <p className="text-center text-gray-500">© 2025 Atlas. All rights reserved.</p>
        </LayoutBox>
    </LayoutBox>
  );
}