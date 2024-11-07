// app/api/generate-banner/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const response = await fetch('http://44.201.113.177:5001/generate-banner', {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            console.error('Error processing request:', response);
            // delay by 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Return dummy data
            const mockResponse = {
                urls: [
                    "https://fal.media/files/monkey/-pYzAhN2ZH2yf-u17Xy-F_949708e4408c403bac4e5d99f1179bf9.jpg",
                    "https://fal.media/files/monkey/-pYzAhN2ZH2yf-u17Xy-F_949708e4408c403bac4e5d99f1179bf9.jpg",
                    "https://fal.media/files/monkey/-pYzAhN2ZH2yf-u17Xy-F_949708e4408c403bac4e5d99f1179bf9.jpg",
                    "https://fal.media/files/monkey/-pYzAhN2ZH2yf-u17Xy-F_949708e4408c403bac4e5d99f1179bf9.jpg"
                ]
            };
            return NextResponse.json({ urls: mockResponse.urls });
        }

        // if (!response.ok) {
        //     // Return dummy data
        //     return NextResponse.json({
        //         url: "https://fal.media/files/monkey/-pYzAhN2ZH2yf-u17Xy-F_949708e4408c403bac4e5d99f1179bf9.jpg",
        //         text_specifications: [
        //             {
        //                 text: "sample test heading",
        //                 color: "#282828",
        //                 font: "Epilogue",
        //                 position: "center"
        //             },
        //             {
        //                 text: "sample test sub heading",
        //                 color: "#282828",
        //                 font: "Arial",
        //                 position: "bottom"
        //             }
        //         ]
        //     });
        // }

        // we need to convert response.json to required format
        const data = await response.json();
        console.log('Recieived Data:', data);
        console.log('Recieived URLS:', data.top_urls);
        return NextResponse.json({ urls: data.top_urls });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}