import Link from "next/link";
import { converterList } from "@/config/converter-list";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ConvertHomePage() {
  return (
    <div className="min-h-screen py-12 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">
          Text Converter Playground 🧪
        </h1>
        <p className="text-muted-foreground text-lg">
          Choose a converter to get started. Built for speed, scale, and spicy
          transforms 🌶️
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {converterList.map(({ slug, name, description }) => (
          <Link key={slug} href={`/convert/${slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
