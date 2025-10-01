import { LayoutBox } from './LayoutBox.jsx';

export default function Footer() {
  return (
    <LayoutBox className="h-32 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
            <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-400 rounded"></div>
            <div className="space-y-1">
                <div className="h-3 w-16 bg-gray-300 rounded"></div>
                <div className="h-3 w-20 bg-gray-300 rounded"></div>
                <div className="h-3 w-14 bg-gray-300 rounded"></div>
            </div>
            </div>
            <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-400 rounded"></div>
            <div className="space-y-1">
                <div className="h-3 w-18 bg-gray-300 rounded"></div>
                <div className="h-3 w-16 bg-gray-300 rounded"></div>
                <div className="h-3 w-20 bg-gray-300 rounded"></div>
            </div>
            </div>
            <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-400 rounded"></div>
            <div className="space-y-1">
                <div className="h-3 w-14 bg-gray-300 rounded"></div>
                <div className="h-3 w-18 bg-gray-300 rounded"></div>
            </div>
            </div>
            <div className="space-y-2">
            <div className="h-4 w-18 bg-gray-400 rounded"></div>
            <div className="flex space-x-2">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
            </div>
        </div>
        <LayoutBox label="Footer" className="h-32 mt-8">
            <p className="text-center text-gray-500">© 2025 Atlas. All rights reserved.</p>
        </LayoutBox>
    </LayoutBox>
  );
}