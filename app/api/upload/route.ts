import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Optional: limit file size
    },
  },
};

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { file } = req.body;

//   if (!file) return res.status(400).json({ error: "No file provided" });

//   try {
//     const uploadResponse = await cloudinary.uploader.upload(file, {
//       folder: "brands", // Optional folder name
//     });
//     console.log("uploadResponse", uploadResponse);
//     res.status(200).json({ url: uploadResponse.secure_url });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// }

export async function POST(request: Request) {
  const data = await request.json();
  const { file } = data;
  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: "brands", // Optional folder name
    });
    return NextResponse.json(
      { url: uploadResponse.secure_url },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
