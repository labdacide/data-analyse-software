import React, { useState } from "react";
import { NextPage } from "next";
import * as Icon from "react-feather";
import classNames from "classnames";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui";

const fullMember = {
    address: "0x1a94551a455cf82877c80c3c1ead0dd67a956737",
    platform: "ETH",
    workspaceId: 5,
    banned: false,
    collection: [
        {
            address: "0x01662b3dd5c556aecbbd5efcc809ef22026cac26",
            platform: "ETH",
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0017,
            name: "PixelPuppersNFT",
            spam: false,
            symbol: "PXP",
            thumbnail:
                "https://i.seadn.io/gcs/files/903d95aa2167f28b042f3ceb17b30d54.gif?w=500&auto=format",
            updatedAt: "2023-01-10T12:47:14.126000",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000000ee",
            balance: 8,
        },
        {
            address: "0x1cad7900050722a1ecc2d36fc04dd21f3906b373",
            platform: "ETH",
            name: "TheLastWarriorInWeb3",
            symbol: "TLWIW",
            category: "ERC721",
            spam: false,
            thumbnail:
                "https://i.seadn.io/gcs/files/c48d17b629d3599354b67c421bd058ea.gif?w=500&auto=format",
            floorprice: 0.0002999,
            currency: "ETH",
            updatedAt: "2023-01-10T13:10:41.539000",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000009b7",
            balance: 10,
        },
        {
            address: "0x21453960e45e073f0447fa9f7eeb0aeb2bf5c84e",
            platform: "ETH",
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0074,
            name: "Tiger Tiger Tiger",
            spam: false,
            symbol: "Tiger Club",
            thumbnail:
                "https://i.seadn.io/gcs/files/1f838e4749c7fc1c5a8d6504becef604.jpg?w=500&auto=format",
            updatedAt: "2023-01-09T13:56:41.238000",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000c73",
            balance: 1,
        },
        {
            address: "0x21b06a1e6111c2581860e6b13afd0fbd72bb1fae",
            platform: "ETH",
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0025,
            name: "Web4Ded",
            spam: false,
            symbol: "W4D",
            thumbnail:
                "https://i.seadn.io/gcs/files/758ea8563ba4f128b28c2c007b30de97.png?w=500&auto=format",
            updatedAt: "2023-01-09T13:48:49.485000",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000015b9",
            balance: 5,
        },
    ],
    discordId: "301014682481852418",
    discordUsername: "NerobiX",
    netWorth: {
        currency: "ETH",
        value: 100.50359497999999,
        usd: 133333.094280217,
    },
    updatedAt: "2023-01-10T13:10:51.585000",
    discord: {
        id: "301014682481852418",
        username: "NerobiX",
        discriminator: "8052",
        locale: "fr",
    },
    twitter: {
        id: 1142744726396952600,
        name: "Ner0",
        screen_name: "NerObix_",
        description: "🇧🇪🇲🇦 - Business Engineer student",
        followings: 1425,
        followers: 112,
        tweets: 2614,
        likes: 7396,
        location: "Bruxelles, Belgique",
        created_at: "2019-06-23T10:42:28",
    },
    balance: {
        value: 0.6237195746226636,
        currency: "ETH",
        usd: 827.4575736731567,
    },
};

const unkMember = {
    address: "0x7E3E8E243BD07918F996F7c42AA0B14Fb7dFE0C5",
    netWorth: {
        currency: "ETH",
        value: 26.834849239999997,
        usd: 35600.452744245995,
    },
    collection: [
        {
            address: "0x0000000010c38b3d8b4d642d9d065fb69bc77bc7",
            balance: 1,
            category: "ERC1155",
            currency: "ETH",
            floorprice: 4.99,
            name: "underground",
            platform: "ETH",
            spam: false,
            symbol: "ug",
            thumbnail:
                "https://i.seadn.io/gae/UA7blhz93Jk6GHmFA_q7lLFVrnaIJcVSIQlAh9-c4KzTC28Ewt7xlcTbqHjc1Znd6j16Rg10SVkbY2WzHckG5FD4kQ2WE6GTnPE0Lw?w=500&auto=format",
            tokenId: "0x01",
        },
        {
            address: "0x02bdb0411e7416bdcfba5ed9d733b666162694b6",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "OJIS Key",
            platform: "ETH",
            spam: false,
            symbol: "OJIS Key",
            thumbnail:
                "https://i.seadn.io/gcs/files/026d37bf6cdccec9b6d727cb140816c3.jpg?w=500&auto=format",
            tokenId: "0x3a",
        },
        {
            address: "0x03a980c83bb58838298ea7689d9d4d22aad51599",
            balance: 1,
            category: "ERC1155",
            currency: "ETH",
            floorprice: 0.003,
            name: "Genesis Merchant Company Employee Badge",
            platform: "ETH",
            spam: false,
            symbol: null,
            thumbnail:
                "https://res.cloudinary.com/alchemyapi/image/upload/thumbnail/eth-mainnet/bc8e8c54faf32fc7208c71a9b80ec670",
            tokenId: "0x00",
        },
        {
            address: "0x03f11ce01170463859feb34bdfacc35b7dc79906",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: " PUBG Mint Pass Genesis",
            platform: "ETH",
            spam: false,
            symbol: " PUBG Mint Pass Genesis",
            thumbnail:
                "https://i.seadn.io/gcs/files/8190e39a6fa0c5a5d5accdae9241673c.jpg?w=500&auto=format",
            tokenId: "0x09",
        },
        {
            address: "0x056667e4f0a6b7dfbe0b5e3d0bf8a3b0f3d6293e",
            balance: 1,
            category: "ERC721",
            currency: null,
            floorprice: 0,
            name: "Slim FlyingLand Pass",
            platform: "ETH",
            spam: false,
            symbol: "Slim FlyingLand Pass",
            thumbnail:
                "https://i.seadn.io/gcs/files/b11bf4409701dc902521deb6abe8a70b.png?w=500&auto=format",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000009c",
        },
        {
            address: "0x0583d8a8d0ad0895721e905af86a83c29a6fcffe",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Blue Troublemaker Genesis Item",
            platform: "ETH",
            spam: false,
            symbol: "Blue Troublemaker Genesis Item",
            thumbnail:
                "https://i.seadn.io/gcs/files/9db7c9fbe257b2351f24b742fd9a3f5d.png?w=500&auto=format",
            tokenId: "0x0188",
        },
        {
            address: "0x0a16305612706b4eabce43247d61fe7fbed708e4",
            balance: 5,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.101,
            name: "Metropolis World Passport",
            platform: "ETH",
            spam: false,
            symbol: "METWA",
            thumbnail:
                "https://i.seadn.io/gcs/files/fa8624c350bab4f07b79333c3b789201.png?w=500&auto=format",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000011df",
        },
        {
            address: "0x10b7823f0aa2ae2c54aaee08e4ed9cecc8dc779c",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.035,
            name: "Rodro Editions",
            platform: "ETH",
            spam: false,
            symbol: "RDE",
            thumbnail:
                "https://i.seadn.io/gcs/files/baf86a4de6ce30db899a803b01e160ae.jpg?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000142",
        },
        {
            address: "0x1254f3c0968ef1ada5d2ee32f1a047f2d51f1e4a",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.00294444,
            name: "ZENGA",
            platform: "ETH",
            spam: false,
            symbol: "ZNG",
            thumbnail:
                "https://i.seadn.io/gcs/files/3a0f9faf15d66d6311400b8539367c9d.jpg?w=500&auto=format",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000008d",
        },
        {
            address: "0x15cc16bfe6fac624247490aa29b6d632be549f00",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.1,
            name: "AnonymiceBreeding",
            platform: "ETH",
            spam: false,
            symbol: "BABYMICE",
            thumbnail:
                "https://i.seadn.io/gae/Zg42usewFZQAF5T_0w0aBzy2zxEAglm6uL45tpqH9k_CfbKvgWSK_n4hKBmIxurQHhVlCskKz06-w1PxuugoNC2tIwhUbGU6dslW2A?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000683",
        },
        {
            address: "0x15d0bdd0abeab6a87d6ddcd4aa2c88b39959d5ba",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Blue CyberKongz:Play & Kollect",
            platform: "ETH",
            spam: false,
            symbol: "Blue CyberKongz:Play & Kollect",
            thumbnail:
                "https://i.seadn.io/gcs/files/7190fda9ff0c2f8cee6a9d6e0d73f7d6.gif?w=500&auto=format",
            tokenId: "0x52",
        },
        {
            address: "0x1846f7892038e9b0c54aa39b7256993b6e18cd75",
            balance: 1,
            category: "ERC721",
            currency: null,
            floorprice: 0,
            name: "Secret Px Tickets",
            platform: "ETH",
            spam: false,
            symbol: "Secret Px Tickets",
            thumbnail:
                "https://i.seadn.io/gcs/files/0abb1d817a5bc92b85f44504bf5672de.png?w=500&auto=format",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000007c",
        },
        {
            address: "0x19a3cba5564541b50a454acf6e7334170482e6a5",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "BestFriends",
            platform: "ETH",
            spam: false,
            symbol: "BestFriends",
            thumbnail:
                "https://i.seadn.io/gcs/files/f7ec4da87bdf42006488806213140be7.png?w=500&auto=format",
            tokenId: "0xce",
        },
        {
            address: "0x19b436638d31bf38ba33924e6e25f8ce2a764a52",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.00999,
            name: "Spirit Gates",
            platform: "ETH",
            spam: false,
            symbol: "SG",
            thumbnail:
                "https://i.seadn.io/gcs/files/4eff4fafa5eebd6afccc93dbfab5223f.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000c18",
        },
        {
            address: "0x1fa8559e873f698292766790aecf8080a66433f6",
            balance: 2,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.001,
            name: "Space Jumpers",
            platform: "ETH",
            spam: false,
            symbol: "SPS",
            thumbnail:
                "https://i.seadn.io/gcs/files/befb4e240b54fa71714a0edb8a55eaf5.gif?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000203",
        },
        {
            address: "0x1ffcd1f2511d4a277a7efc08a4f3e808544f6ab0",
            balance: 8,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0089,
            name: "AMATO",
            platform: "ETH",
            spam: false,
            symbol: "AMT",
            thumbnail:
                "https://i.seadn.io/gcs/files/2dcf3284305d2ec3dbba43eeb6afb069.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000756",
        },
        {
            address: "0x232a68a51d6e07357ae025d2a459c16077327102",
            balance: 1,
            category: "ERC1155",
            currency: "ETH",
            floorprice: 0.167,
            name: null,
            platform: "ETH",
            spam: false,
            symbol: null,
            thumbnail:
                "https://i.seadn.io/gae/du9RMWp2oTtFUo7W-qlft41zLwptMy4tgSTE3ieghzVs7hj4uFe4lSks5kz5kYjKmso-En2_HKmA7SrrKH_yzMZGycFT3HQ63s1Z?w=500&auto=format",
            tokenId: "0x0e",
        },
        {
            address: "0x2841413795bbe4e42c1a8558b3e55ecde4a12014",
            balance: 2,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.00089,
            name: "Tamagogi",
            platform: "ETH",
            spam: true,
            symbol: "TMGG",
            thumbnail:
                "https://i.seadn.io/gcs/files/9ea49eb9e3f330409176c147945094aa.png?w=500&auto=format",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000048c",
        },
        {
            address: "0x2a91e656f845b906e8b42658a0741be72dd0e615",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Gold Saucer Chip",
            platform: "ETH",
            spam: false,
            symbol: "GSCHIP",
            thumbnail:
                "https://i.seadn.io/gcs/files/6db5541069540e98feee885416a29b90.gif?w=500&auto=format",
            tokenId: "0x01",
        },
        {
            address: "0x30d5695b1e74d28d1e50c4f243c90297d8eff403",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Mad Exomon Limited",
            platform: "ETH",
            spam: false,
            symbol: "Mad Exomon Limited",
            thumbnail:
                "https://i.seadn.io/gcs/files/8ee8121b97d22110712f8eb2d64d058d.webp?w=500&auto=format",
            tokenId: "0x01",
        },
        {
            address: "0x35b7d1fd19ae93f8c510e1b152bb4bcf0615a505",
            balance: 5,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.00489,
            name: "3GMAIPFP",
            platform: "ETH",
            spam: false,
            symbol: "3GMAIPFP",
            thumbnail:
                "https://i.seadn.io/gcs/files/c7fce5b458784f27db341b9149b04a74.png?w=500&auto=format",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000006c",
        },
        {
            address: "0x37899f81e8385fc50e85c070e8ee99a263725aea",
            balance: 5,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0012,
            name: "Spacebots - A FREE mint collection",
            platform: "ETH",
            spam: false,
            symbol: "RAW",
            thumbnail:
                "https://i.seadn.io/gcs/files/20c9418ea8d1014c42d7e573f4e978e0.jpg?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000c74",
        },
        {
            address: "0x384ba6cd631c0712bf28c7cb1e3bb150f3195abe",
            balance: 2,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0025,
            name: "THE CODE",
            platform: "ETH",
            spam: false,
            symbol: "CODE",
            thumbnail:
                "https://i.seadn.io/gcs/files/f99fd53dfba4e8cc59eb45e288b5847f.png?w=500&auto=format",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000012d",
        },
        {
            address: "0x39d01af55ae9e7f66dde98ee63c04e06795a03d2",
            balance: 1,
            category: "ERC721",
            currency: null,
            floorprice: 0,
            name: "Secret MoodFlip Pass",
            platform: "ETH",
            spam: false,
            symbol: "Secret MoodFlip Pass",
            thumbnail:
                "https://i.seadn.io/gcs/files/9b5ef063e9d807545e302ea3e8823639.png?w=500&auto=format",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000000ef",
        },
        {
            address: "0x4278ed483af804eb9a0edf59fc7c428a5a0b5c20",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.589,
            name: "Degenesis",
            platform: "ETH",
            spam: false,
            symbol: "DGNS",
            thumbnail:
                "https://i.seadn.io/gae/SLb8ii_FM3ZqETINgOQeBsnTukcfaDhMEpiL8ZCen6HRLv8hTCjZRLT4189y21Fzk-Xf0BcIvpMMjJ6W1hXaMbDERGxFnkMvF7aY?w=500&auto=format",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000003c",
        },
        {
            address: "0x42dc0cecefbaf8e81d631a75fa212510c347f66b",
            balance: 1,
            category: "ERC721",
            currency: null,
            floorprice: 0,
            name: "BasedHeads",
            platform: "ETH",
            spam: false,
            symbol: "BASED",
            thumbnail:
                "https://res.cloudinary.com/alchemyapi/image/upload/thumbnail/eth-mainnet/4c0e63557cba12c2d26599c675074f1b",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000181f",
        },
        {
            address: "0x4511d796937fd5b238911bd560d85ccc650d9b34",
            balance: 2,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.001,
            name: "Cute Pets",
            platform: "ETH",
            spam: false,
            symbol: "CUTEPT",
            thumbnail:
                "https://i.seadn.io/gcs/files/d5de7873889af9c575589ffcfc857ba6.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000076",
        },
        {
            address: "0x465b67ce48a1da6e93c02b1c62cb03bfeebb6f6a",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Red RiseLikePhoenix",
            platform: "ETH",
            spam: false,
            symbol: "Red RiseLikePhoenix",
            thumbnail:
                "https://i.seadn.io/gcs/files/c7720321a97355cdbda02b18a7f82556.gif?w=500&auto=format",
            tokenId: "0x0195",
        },
        {
            address: "0x469c9b763552e942bb0334b16163d56ace1b0745",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Naruto Ninjas Origin",
            platform: "ETH",
            spam: false,
            symbol: "Naruto Ninjas Origin",
            thumbnail:
                "https://i.seadn.io/gcs/files/ee5a260b2d1963df7faa7c4ae170f088.jpg?w=500&auto=format",
            tokenId: "0x01",
        },
        {
            address: "0x47da053384abd2ee2bf4883927e7e1dcc3f5f95b",
            balance: 1,
            category: "ERC1155",
            currency: "ETH",
            floorprice: 0.0149,
            name: "Genesis Merchant Company Supply Drop",
            platform: "ETH",
            spam: false,
            symbol: "GMCSD",
            thumbnail:
                "https://i.seadn.io/gcs/files/6cf64f0ee931284a961eda0560f597d3.jpg?w=500&auto=format",
            tokenId: "0x00",
        },
        {
            address: "0x495f947276749ce646f68ac8c248420045cb7b5e",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "OpenSea Shared Storefront",
            platform: "ETH",
            spam: false,
            symbol: "OPENSTORE",
            thumbnail:
                "https://res.cloudinary.com/alchemyapi/image/upload/thumbnail/eth-mainnet/b8cd9b1dab2f99b812fa6d37c029d1b2",
            tokenId:
                "0x8cf8b30b157ea322321964e295a7015c318cbd6d0000000000000300000003b6",
        },
        {
            address: "0x49bb6e24cdb2795e624208c380f85898000453da",
            balance: 1,
            category: "ERC721",
            currency: null,
            floorprice: 0,
            name: "Goblinchests.wtf Mint Pass",
            platform: "ETH",
            spam: false,
            symbol: "GsMP",
            thumbnail:
                "https://i.seadn.io/gcs/files/71648a0e8997ee4fc2cd7e5f544fbef9.gif?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000237",
        },
        {
            address: "0x49c3fb5ed059e3960898ede11cd9a0151460c3b8",
            balance: 2,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.084,
            name: "EatCollective",
            platform: "ETH",
            spam: false,
            symbol: "EAT",
            thumbnail:
                "https://i.seadn.io/gcs/files/480e9dfde1e6fe8f73453384ae0be838.png?w=500&auto=format",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000001c5",
        },
        {
            address: "0x4c534034a06f11ecb638bf71a097c168a052a659",
            balance: 3,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0001,
            name: "Tamagogi Pets",
            platform: "ETH",
            spam: false,
            symbol: "TAMAGOGI",
            thumbnail:
                "https://i.seadn.io/gcs/files/e2bfa1ddcbef4cbe7d359fb0f8bd1807.png?w=500&auto=format",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000004ac",
        },
        {
            address: "0x59775fd5f266c216d7566eb216153ab8863c9c84",
            balance: 5,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.04,
            name: "NightmareImpTreasureBox",
            platform: "ETH",
            spam: false,
            symbol: "IMPTREASURE",
            thumbnail:
                "https://i.seadn.io/gcs/files/7c016d20f18c0a77f5deb5d38ad7dbd3.png?w=500&auto=format",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000014d5",
        },
        {
            address: "0x5c1c10390e70b658bda02cdc6a5862b1448a5b78",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Green Troublemaker",
            platform: "ETH",
            spam: false,
            symbol: "Green Troublemaker",
            thumbnail:
                "https://i.seadn.io/gcs/files/9db7c9fbe257b2351f24b742fd9a3f5d.png?w=500&auto=format",
            tokenId: "0x01",
        },
        {
            address: "0x5e7785832bf01db467f2811e0952d893f4dc0e6a",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "The Lunar Colony Original",
            platform: "ETH",
            spam: false,
            symbol: "The Lunar Colony Original",
            thumbnail:
                "https://i.seadn.io/gcs/files/e49d2fa45ada7640684cfd86e015b174.png?w=500&auto=format",
            tokenId: "0x0195",
        },
        {
            address: "0x5f48045f3a1a19ab9985418869f77612cfa752d6",
            balance: 5,
            category: "ERC1155",
            currency: "ETH",
            floorprice: 0.0015,
            name: null,
            platform: "ETH",
            spam: false,
            symbol: null,
            thumbnail:
                "https://i.seadn.io/gcs/files/542efd193b841482d7018ab7d231dacb.png?w=500&auto=format",
            tokenId: "0x01",
        },
        {
            address: "0x602390365cf981226231f6f9a0e4dbd7a04b9a7e",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.294,
            name: "Sensthesia",
            platform: "ETH",
            spam: false,
            symbol: "SENSTH",
            thumbnail:
                "https://i.seadn.io/gcs/files/8ae57a4f0923c22ec8e7477c72488109.jpg?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000003",
        },
        {
            address: "0x618512f4a7c6c8231cd75b794669c02104b6aef1",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Shadow Assassins Mint Pass Collection",
            platform: "ETH",
            spam: false,
            symbol: "Shadow Assassins Mint Pass Collection",
            thumbnail:
                "https://i.seadn.io/gcs/files/685751268b01c68829c5c1b48b6dbe4f.jpg?w=500&auto=format",
            tokenId: "0x09",
        },
        {
            address: "0x623d780b0e97d4e48e7dc67b7324bd5776110627",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.75,
            name: "JPEG'd Elephant",
            platform: "ETH",
            spam: false,
            symbol: "SUCK",
            thumbnail:
                "https://res.cloudinary.com/alchemyapi/image/upload/thumbnail/eth-mainnet/5134b8078d200c906c84a0e7b89c6233",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000045",
        },
        {
            address: "0x664ab4cebe87d1526d741c9dc4fcb546c9fa8bc7",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Secret Racing Ticket",
            platform: "ETH",
            spam: false,
            symbol: "Secret Racing Ticket",
            thumbnail:
                "https://i.seadn.io/gcs/files/ae971ab6b0deb2b154f5162baec8d036.jpg?w=500&auto=format",
            tokenId: "0xc9",
        },
        {
            address: "0x69be2c18a3c7acd14d5114a66f2dad3e96150427",
            balance: 7,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.02,
            name: "0% PROJECT",
            platform: "ETH",
            spam: false,
            symbol: "0PRCNT",
            thumbnail:
                "https://i.seadn.io/gcs/files/1db5b31e62e3efe44460838b01dc7a40.gif?w=500&auto=format",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000001b",
        },
        {
            address: "0x795baa0b8f58bb4af50311d27c25027cc4ba5f9b",
            balance: 2,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0035,
            name: "ATSUI NFT",
            platform: "ETH",
            spam: false,
            symbol: "ANFT",
            thumbnail:
                "https://i.seadn.io/gcs/files/5ed5a222279625ea5e867e4c6ad94d87.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000246",
        },
        {
            address: "0x7a74520638db25f9aa8cdace2d0e7769f28896d2",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "TheLandSafe Original",
            platform: "ETH",
            spam: false,
            symbol: "TheLandSafe Original",
            thumbnail:
                "https://i.seadn.io/gcs/files/d5e90274ab7e02022c5c4dfb28082acd.jpg?w=500&auto=format",
            tokenId: "0x01",
        },
        {
            address: "0x7bc25283a29a3888cab4555ea86ff1a8c18cc90a",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0029,
            name: "Set In Merge",
            platform: "ETH",
            spam: false,
            symbol: "SIM",
            thumbnail:
                "https://i.seadn.io/gcs/files/d6d4d84ea187ad228a97c5f9eaea8380.jpg?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000001b14",
        },
        {
            address: "0x7fef3f3364c7d8b9bfabb1b24d5ce92a402c6bd3",
            balance: 2,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0098,
            name: "Spells",
            platform: "ETH",
            spam: false,
            symbol: "SPELL",
            thumbnail:
                "https://i.seadn.io/gcs/files/6680baa06b040979355f7cdf7dbe98b9.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000536",
        },
        {
            address: "0x7ffe10bc9808135999bc235f07b4ce45fa687a52",
            balance: 2,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.03,
            name: "Proof of (No) Work",
            platform: "ETH",
            spam: false,
            symbol: "PONW",
            thumbnail:
                "https://i.seadn.io/gcs/files/de47de1ed12d33ff697efb004aa0b36c.gif?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000063",
        },
        {
            address: "0x8270fc3b2d23de703b265b2abe008883954fea8e",
            balance: 4,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.05,
            name: "KUMALEON",
            platform: "ETH",
            spam: true,
            symbol: "KUMA",
            thumbnail:
                "https://i.seadn.io/gcs/files/676d509bbc885f3a7572512575c1312a.png?w=500&auto=format",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000029d",
        },
        {
            address: "0x827e9636a60a3d6125c6e7b0093151421d46191f",
            balance: 1,
            category: "ERC721",
            currency: null,
            floorprice: 0,
            name: "Nancy Plastic",
            platform: "ETH",
            spam: false,
            symbol: "Nancy Plastic",
            thumbnail:
                "https://i.seadn.io/gcs/files/b11bf4409701dc902521deb6abe8a70b.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000139",
        },
        {
            address: "0x86be523761058d3ef23a7f4d6a78c3e29f63d0d7",
            balance: 4,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0009,
            name: "w00ts",
            platform: "ETH",
            spam: true,
            symbol: "w00t",
            thumbnail:
                "https://i.seadn.io/gcs/files/b6ec8a75bb6c9716026315ce5e60619e.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000114",
        },
        {
            address: "0x8887ce34f6f1a4de4e8eb2a9195eeb261c413365",
            balance: 2,
            category: "ERC1155",
            currency: "ETH",
            floorprice: 0.0228,
            name: "raw contract",
            platform: "ETH",
            spam: false,
            symbol: "RAW",
            thumbnail:
                "https://i.seadn.io/gae/HrPlG89oureGNlwYc9_hFvpm2OPFbQB3KIMbnNI3mc4bkZAsW9gKrGxDXsiFg0PV8emH6_3OK--zYyhTX_wKUa1VN7T2vt047Zv_RA?w=500&auto=format",
            tokenId: "0x16",
        },
        {
            address: "0x89e7f6f8a7715e430cf156fe44cfbb8cbabacc95",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Crypto Legends Limited",
            platform: "ETH",
            spam: false,
            symbol: "Crypto Legends Limited",
            thumbnail:
                "https://i.seadn.io/gcs/files/5cdf51288aaed2132d208b20f312bad8.png?w=500&auto=format",
            tokenId: "0x0184",
        },
        {
            address: "0x8b213d1afc4e13113f876574005bd14ea60ade73",
            balance: 2,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.04,
            name: "Bonx Natives",
            platform: "ETH",
            spam: false,
            symbol: "BONX",
            thumbnail:
                "https://i.seadn.io/gcs/files/d6db3b5c6370cb0848f8e159ddf1c2bb.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000059",
        },
        {
            address: "0x8d4c163126cdaf53a9376e6f15c6632f5343a5af",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "HeyBearsClub",
            platform: "ETH",
            spam: false,
            symbol: "HeyBearsClub",
            thumbnail:
                "https://i.seadn.io/gcs/files/5b13dc7f05811f00723cb888f533ded8.png?w=500&auto=format",
            tokenId: "0x03",
        },
        {
            address: "0x8efd1039f78ab22f72b0d27fa586c5ed2908eac4",
            balance: 2,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0049,
            name: "The Devils Grimoire",
            platform: "ETH",
            spam: false,
            symbol: "TDG",
            thumbnail:
                "https://i.seadn.io/gcs/files/c1b9eb9e9e7f6e6367a95229c33927a0.jpg?w=500&auto=format",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000000cd",
        },
        {
            address: "0x8f6a4d8ad2493adfd7d1540ccdba11bde5c7eb9e",
            balance: 3,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.042,
            name: "Degenheim",
            platform: "ETH",
            spam: false,
            symbol: "DGNH",
            thumbnail:
                "https://i.seadn.io/gcs/files/54b6f02960ef1f586ba644f21e320278.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000001a65",
        },
        {
            address: "0x9251dec8df720c2adf3b6f46d968107cbbadf4d4",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.1313,
            name: "1337 skulls",
            platform: "ETH",
            spam: false,
            symbol: "1337skulls",
            thumbnail:
                "https://i.seadn.io/gae/78xb5ptpGXtCJZtEMYKRsJjFdgUECLiju4tZegiL-Cv0Uqn3TTG4LFJPo2W4FTL393JUr_jlxJNu91seRFanRRtBT5P9dFK4d8mytB0?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000001415",
        },
        {
            address: "0x97ea9a28d9c24ddbcb095dea5fc819a6f61aba90",
            balance: 14,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.001,
            name: "Hopperz",
            platform: "ETH",
            spam: false,
            symbol: "HOPZ",
            thumbnail:
                "https://i.seadn.io/gcs/files/7d23f13b0c4fe35a42101c71184eac4a.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000091",
        },
        {
            address: "0x99d6e8742ec4eac5b0a77a2b55df0ecd658aefd9",
            balance: 5,
            category: "ERC1155",
            currency: "ETH",
            floorprice: 0.0219,
            name: null,
            platform: "ETH",
            spam: false,
            symbol: null,
            thumbnail:
                "https://i.seadn.io/gcs/files/4f3ee9622d0e23339c83a55a3a9c5f7f.png?w=500&auto=format",
            tokenId: "0x03",
        },
        {
            address: "0x9ce07b945b4cb912e338d141cf95e9636bf2e836",
            balance: 1,
            category: "ERC1155",
            currency: "ETH",
            floorprice: 0.0144,
            name: "Hope",
            platform: "ETH",
            spam: false,
            symbol: "Hope",
            thumbnail:
                "https://i.seadn.io/gcs/files/fa0e086e31206911fb2a7ea258d66b4d.gif?w=500&auto=format",
            tokenId: "0x03",
        },
        {
            address: "0x9f608060c234f70d83ba16ad9277cd42f7dcff49",
            balance: 1,
            category: "ERC1155",
            currency: "ETH",
            floorprice: 0.27389,
            name: null,
            platform: "ETH",
            spam: false,
            symbol: null,
            thumbnail:
                "https://i.seadn.io/gae/fYR0tJ4gVuuYgGPdBK7EjYyXoqoFi_2GS2iv3uGKSEA3FrL1prVUh20R7EwZU9JHfmqmlOEZxVGf846jesoXLSMmsslJ8Dv-ZqAvOZk?w=500&auto=format",
            tokenId: "0x00",
        },
        {
            address: "0xa0f666c3a41cbae92699db6bf7e338f3c7d26e45",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Gold Husl Founder Cards",
            platform: "ETH",
            spam: false,
            symbol: "Gold Husl Founder Cards",
            thumbnail:
                "https://i.seadn.io/gcs/files/754e38769c80c9d6188444dddb10ec80.png?w=500&auto=format",
            tokenId: "0x0147",
        },
        {
            address: "0xa35aa193f94a90eca0ae2a3fb5616e53c1f35193",
            balance: 10,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0055,
            name: "Marimo",
            platform: "ETH",
            spam: false,
            symbol: "MRM",
            thumbnail:
                "https://i.seadn.io/gcs/files/c192e3a6cd31b239cd75dc250e8b3e43.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000a9b",
        },
        {
            address: "0xa6cd596202556c88f87be4593abd376ba6339124",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Blue Troublemaker Genesis Collection",
            platform: "ETH",
            spam: false,
            symbol: "Blue Troublemaker Genesis Collection",
            thumbnail:
                "https://i.seadn.io/gcs/files/59a5472e107f08541260d23ad0e2290a.jpg?w=500&auto=format",
            tokenId: "0x0188",
        },
        {
            address: "0xa6d0eea3afab2696a840731537874e058bc8049f",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0199,
            name: "Scales by Anna Judd",
            platform: "ETH",
            spam: false,
            symbol: "SCALES",
            thumbnail:
                "https://i.seadn.io/gcs/files/6836e697204002b672b441276cc2d21f.gif?w=500&auto=format",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000009f9",
        },
        {
            address: "0xa9ba1a433ec326bca975aef9a1641b42717197e7",
            balance: 7,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.078,
            name: "Gangster All Star: Evolution",
            platform: "ETH",
            spam: false,
            symbol: "GAS:EVO",
            thumbnail:
                "https://i.seadn.io/gcs/files/e3d12b7b71c75a02256f9d34fe35824e.gif?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000405",
        },
        {
            address: "0xaa02c71d522c54061430ed73752b1ea343bfb9f4",
            balance: 1,
            category: "ERC721",
            currency: null,
            floorprice: 0,
            name: "goblingem.wtf Mint Pass",
            platform: "ETH",
            spam: false,
            symbol: "GGMP",
            thumbnail:
                "https://i.seadn.io/gcs/files/48ee7f17434a052f8421690b69dc6ca9.gif?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000232",
        },
        {
            address: "0xabb3738f04dc2ec20f4ae4462c3d069d02ae045b",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.000989999999999,
            name: "KnownOriginDigitalAsset",
            platform: "ETH",
            spam: false,
            symbol: "KODA",
            thumbnail:
                "https://i.seadn.io/gae/53L422-5QSOKOaWTu3-EWZkymYoyFo6L60AnxPXqz4rNgX1-E162tIljSyVOa3hyVACvJNGdih4lFummnHPx-1Fa?w=500&auto=format",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000012fd9f7",
        },
        {
            address: "0xadb836a120b80a700aa93ea98181816bb2268c53",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "The Meta Land Club",
            platform: "ETH",
            spam: false,
            symbol: "The Meta Land Club",
            thumbnail:
                "https://i.seadn.io/gcs/files/5c0d56d6aa463dd17c2916b223aacf70.png?w=500&auto=format",
            tokenId: "0x01",
        },
        {
            address: "0xb716859aba27aa123383666272feda9fa269bf68",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "The E4C Rangers Origin",
            platform: "ETH",
            spam: false,
            symbol: "The E4C Rangers Origin",
            thumbnail:
                "https://i.seadn.io/gcs/files/a6e4027a65923242885508085b6af956.jpg?w=500&auto=format",
            tokenId: "0x21",
        },
        {
            address: "0xb836c05e4bf58e947fcdd884ad469e8ee54cda92",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.3535,
            name: "IconicNFT",
            platform: "ETH",
            spam: false,
            symbol: "IMNFT",
            thumbnail:
                "https://i.seadn.io/gcs/files/cd50e965ba3b1d9308518305d21c7c8c.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000073",
        },
        {
            address: "0xb8dab05398e9453ade9f4e9d832bc635f75be2bf",
            balance: 1,
            category: "ERC721",
            currency: null,
            floorprice: 0,
            name: "BaycShapeShifter",
            platform: "ETH",
            spam: false,
            symbol: "BAYC",
            thumbnail:
                "https://res.cloudinary.com/alchemyapi/image/upload/thumbnail/eth-mainnet/479330be19aa9d872e9f731b6e07875c",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000041c",
        },
        {
            address: "0xbad6186e92002e312078b5a1dafd5ddf63d3f731",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.2399,
            name: "Anonymice",
            platform: "ETH",
            spam: false,
            symbol: "MICE",
            thumbnail:
                "https://i.seadn.io/gae/UdYrqTAU9h9tXf5WqUH8NyKYf_bRK6mBEdJMwQeejU3UbbUrD8rhsw5BlmPY2HdAYnjqJsAqpZgxhXXUDAE4kz5Q7UO8M__xBKrL?w=500&auto=format",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000004b1",
        },
        {
            address: "0xc178994cb9b66307cd62db8b411759dd36d9c2ee",
            balance: 3,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.515,
            name: "COCKPUNCH by Tim Ferriss",
            platform: "ETH",
            spam: false,
            symbol: "COCKPUNCH",
            thumbnail:
                "https://i.seadn.io/gcs/files/0e162c81879c600fbbe78586f61cdc7a.png?w=500&auto=format",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000077b",
        },
        {
            address: "0xc4973de5ee925b8219f1e74559fb217a8e355ecf",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.24,
            name: "HOPE",
            platform: "ETH",
            spam: false,
            symbol: "HOPE",
            thumbnail:
                "https://i.seadn.io/gcs/files/32469815c1d8c3cbec6541f35d991adc.gif?w=500&auto=format",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000113d",
        },
        {
            address: "0xc59d9f3ebf7da9c3b5893df5c34f1d1e8f39df77",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: null,
            platform: "ETH",
            spam: false,
            symbol: null,
            thumbnail:
                "https://i.seadn.io/gcs/files/531fc461519614ceefcd0515a4e529cb.png?w=500&auto=format",
            tokenId: "0x01",
        },
        {
            address: "0xc73b17179bf0c59cd5860bb25247d1d1092c1088",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 9.7238,
            name: "QQL Mint Pass",
            platform: "ETH",
            spam: false,
            symbol: "QQL-MP",
            thumbnail:
                "https://i.seadn.io/gcs/files/820d3d4f318f9140c251081d324beaa2.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000320",
        },
        {
            address: "0xc92c3b7385f048b2ba1f7c9639a2fc48f0dad7c9",
            balance: 20,
            category: "ERC1155",
            currency: "ETH",
            floorprice: 0.0003,
            name: "$PORK NFT",
            platform: "ETH",
            spam: false,
            symbol: "$PORK",
            thumbnail:
                "https://i.seadn.io/gae/i14rMKesG2MznbYw6m7Mif74l-3g-L4FIsbl4VCwfxg_RMoFUMC7Xn4Oz-_jh-Bpp-hdrLdfZCQ7evgmL0GBv8MSO5b6N8Z7bB-_EQ?w=500&auto=format",
            tokenId: "0x00",
        },
        {
            address: "0xc9b16a180c20e7e41cfaef4d94956a895a250057",
            balance: 4,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.001,
            name: "Grenfrens",
            platform: "ETH",
            spam: false,
            symbol: "GFS",
            thumbnail:
                "https://i.seadn.io/gcs/files/49c25f4cdf7c1e1fdb0ee9a4d37f105f.jpg?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000630",
        },
        {
            address: "0xd2a077ec359d94e0a0b7e84435eacb40a67a817c",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 2.99,
            name: "Admit One",
            platform: "ETH",
            spam: false,
            symbol: "ADMIT",
            thumbnail:
                "https://i.seadn.io/gae/w6Px8FSjv3uVTkRUbDwmNDe5lKWaqQcKauNndaiYr6zqPddSAdz0RSLHZX_jD_DF1M4C1H2XZI3SVwO3rJ2uI8DwNZR2-P9Lq55pBU0?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000105",
        },
        {
            address: "0xd433f1601574b2288c32e60ccd2423384fcfd699",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.009,
            name: "Legend-X",
            platform: "ETH",
            spam: false,
            symbol: "LEGENDX",
            thumbnail:
                "https://i.seadn.io/gae/ojwAKtQpc8y0E8P8YS9ziiXTTkILFwMCIXNIRIC0-IFpZW4SFLhl8FUkDq6R2r8cP7cbHylgwgw4HzUMgSdoMQXd7oAVJS_lz8WrRQ0?w=500&auto=format",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000017ca",
        },
        {
            address: "0xd650c5aa88bb8ffc9bce38f5554e38e91f33e300",
            balance: 1,
            category: "ERC1155",
            currency: "ETH",
            floorprice: 1.55,
            name: "Pastel Alpha",
            platform: "ETH",
            spam: false,
            symbol: "PA",
            thumbnail:
                "https://i.seadn.io/gcs/files/151a522edf569dec9c2231d75e76a819.png?w=500&auto=format",
            tokenId: "0x01",
        },
        {
            address: "0xd93206bd0062cc054e397ecccdb8436c3fa5700e",
            balance: 11,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0049,
            name: "Decagon",
            platform: "ETH",
            spam: false,
            symbol: "10GON",
            thumbnail:
                "https://i.seadn.io/gcs/files/6b69c7d3ce68cbde0fedd953c7135e50.jpg?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000169",
        },
        {
            address: "0xda62767106f1666d1fdc24836ca4655f6b4eee46",
            balance: 1,
            category: "ERC1155",
            currency: "ETH",
            floorprice: 4.8e-6,
            name: "Blue",
            platform: "ETH",
            spam: false,
            symbol: "Blue",
            thumbnail:
                "https://i.seadn.io/gcs/files/6dbe0cdb758f1711147a993f8fbafd4e.gif?w=500&auto=format",
            tokenId: "0x11",
        },
        {
            address: "0xe0176ba60efddb29cac5b15338c9962daee9de0c",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.237,
            name: "PREMINT Collector",
            platform: "ETH",
            spam: false,
            symbol: "PREMINTCOLL",
            thumbnail:
                "https://i.seadn.io/gae/aMMR2KXGtRL_jqpS6l1pLoLwUArlwKH9oEnZw-ezBoSANzRGKdManYxuzlB_kztn5bcEQA2Bgx9JWhdEQKLbgj0aFbhC7yFmMS7txw?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000d7f",
        },
        {
            address: "0xe439db43ac8145fdfb74fa16cdda0a3ccfc36fbb",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0097,
            name: "Blank Token",
            platform: "ETH",
            spam: false,
            symbol: "BLT",
            thumbnail:
                "https://i.seadn.io/gcs/files/c5a29c93516d86e00d18bc00b7d86f49.gif?w=500&auto=format",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000003d1",
        },
        {
            address: "0xe5cf984163e6d1447ed1f63981e141ca3986a5fc",
            balance: 1,
            category: "ERC721",
            currency: null,
            floorprice: 0,
            name: "Goblinchest.wtf Mint Pass",
            platform: "ETH",
            spam: false,
            symbol: "cGMP",
            thumbnail:
                "https://i.seadn.io/gcs/files/71648a0e8997ee4fc2cd7e5f544fbef9.gif?w=500&auto=format",
            tokenId:
                "0x000000000000000000000000000000000000000000000000000000000000011d",
        },
        {
            address: "0xe645274bc8c88c4febd77b0a3a6c6c30e91bfe50",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Virtual Victoria Land Collection",
            platform: "ETH",
            spam: false,
            symbol: "Virtual Victoria Land Collection",
            thumbnail:
                "https://i.seadn.io/gcs/files/aad4cd6eac887f87f0e7c840819f6caa.png?w=500&auto=format",
            tokenId: "0xa3",
        },
        {
            address: "0xe65f378d11ba8ea0a1cc5223abc555fa1bbbe2ea",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0083,
            name: "Thunderbirds: IRC Mint Pass",
            platform: "ETH",
            spam: false,
            symbol: "TBMP",
            thumbnail:
                "https://i.seadn.io/gcs/files/c1d651084c001c4ded8bf20452ef13cc.png?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000208",
        },
        {
            address: "0xe6a05f25a051a90d5d144c04f783f6999e48e32d",
            balance: 1,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0129,
            name: "MultibeastsByHaas",
            platform: "ETH",
            spam: false,
            symbol: "MTBST",
            thumbnail:
                "https://i.seadn.io/gcs/files/5a63d1481e61b12937305b2d5fdae5b2.gif?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000770",
        },
        {
            address: "0xe6a85ffd1959402b3ca4278259f2333d6fdf2a9f",
            balance: 4,
            category: "ERC721",
            currency: null,
            floorprice: 0,
            name: "MoonbirdsShapeShifter",
            platform: "ETH",
            spam: false,
            symbol: "MOONBIRDS",
            thumbnail:
                "https://res.cloudinary.com/alchemyapi/image/upload/thumbnail/eth-mainnet/fe743af57f9e3fce3fe68a668044e6b2",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000001101",
        },
        {
            address: "0xeb57d00bdfa202d73b4fc09f6bb4541600ad0f55",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "LockedKongs Jack's Collection",
            platform: "ETH",
            spam: false,
            symbol: "LockedKongs Jack's Collection",
            thumbnail:
                "https://i.seadn.io/gcs/files/7475b434a084ef6fa0ad35000fc089f3.jpg?w=500&auto=format",
            tokenId: "0x0171",
        },
        {
            address: "0xedfc4f35060de1a30e08b0d8b9986a4adbdf6c59",
            balance: 1,
            category: "ERC1155",
            currency: "ETH",
            floorprice: 0.024,
            name: null,
            platform: "ETH",
            spam: false,
            symbol: null,
            thumbnail:
                "https://i.seadn.io/gae/WaqC68uGk9jMOmFdrwP3Pd66Y58HxDq4RUZqqc--Ap1OWAOTAEX9Py9RHfSr0DhDmPYCUlvNfLbRTqRLpZ5GWBiBzmlSU4_LJXhf?w=500&auto=format",
            tokenId: "0x02",
        },
        {
            address: "0xf0638c63140344c143b14dfeb64faaae88b31381",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "Alpha Blocks Item",
            platform: "ETH",
            spam: false,
            symbol: "Alpha Blocks Item",
            thumbnail:
                "https://i.seadn.io/gcs/files/d3fa722a8daaf7c3f1f5171ed878859d.jpg?w=500&auto=format",
            tokenId: "0x02b7",
        },
        {
            address: "0xf17e9f9cb4b42b831a8310adab1c4142da12e306",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "The Metahorse Genesis Originals",
            platform: "ETH",
            spam: false,
            symbol: "The Metahorse Genesis Originals",
            thumbnail:
                "https://i.seadn.io/gcs/files/b25f1ff44ca1133eba0e145cfe4a444d.jpg?w=500&auto=format",
            tokenId: "0x01",
        },
        {
            address: "0xf442459c8bb4b891b789e816775232b812eb2ccd",
            balance: 17,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0001,
            name: "Porkers",
            platform: "ETH",
            spam: false,
            symbol: "PORKER",
            thumbnail:
                "https://i.seadn.io/gcs/files/4fda48c3049f3967515df22a9f7fab73.jpg?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000170",
        },
        {
            address: "0xf6f71a42389ea3627b117efd50793d98f2f6d69c",
            balance: 1,
            category: "ERC721",
            currency: null,
            floorprice: 0,
            name: "The Hormald Community",
            platform: "ETH",
            spam: false,
            symbol: "The Hormald Community",
            thumbnail:
                "https://i.seadn.io/gcs/files/ede96eefd4e4af4f794386c5c4e1d248.jpg?w=500&auto=format",
            tokenId:
                "0x0000000000000000000000000000000000000000000000000000000000000139",
        },
        {
            address: "0xf81e0dfafb1fce54d5c7c2376373d4f499182921",
            balance: 1,
            category: "ERC1155",
            currency: null,
            floorprice: 0,
            name: "The MetaTyans",
            platform: "ETH",
            spam: false,
            symbol: "The MetaTyans",
            thumbnail:
                "https://i.seadn.io/gcs/files/7e53672d59dc7d58dba1004c679ac16f.png?w=500&auto=format",
            tokenId: "0x018a",
        },
        {
            address: "0xface1e5b3fc784c7715b8fd6fc1ce2c023158547",
            balance: 2,
            category: "ERC721",
            currency: "ETH",
            floorprice: 0.0088,
            name: "Dall-E Punks",
            platform: "ETH",
            spam: false,
            symbol: "DUNKZ",
            thumbnail:
                "https://i.seadn.io/gcs/files/03908be02be5878ad207aededb011e7d.png?w=500&auto=format",
            tokenId:
                "0x00000000000000000000000000000000000000000000000000000000000001b5",
        },
    ],
    updatedAt: "2023-01-10T12:50:54.396000",
    workspaceId: 5,
    platform: "ETH",
    balance: {
        value: 12.283478234865328,
        currency: "ETH",
        usd: 16295.876400284089,
    },
};

function kFormatter(num: number, decimals: number = 0) {
    return Math.abs(num) > 9999
        ? (Math.sign(num) * (Math.abs(num) / 1000)).toFixed(1) + "K"
        : num.toFixed(decimals);
}

const CollectionTab: React.FC<{
    collection: typeof fullMember["collection"];
}> = ({ collection }) => {
    return (
        <div>
            <div className="flex -space-x-2">
                {collection
                    .filter((asset) => asset.thumbnail)
                    .slice(0, 6)
                    .map((asset) => (
                        <div key={asset.address}>
                            <img
                                src={asset.thumbnail}
                                title={asset.name}
                                className="w-12 h-12 bg-white rounded-lg border-4 border-white"
                            />
                        </div>
                    ))}
            </div>
            <div className="pt-4 text-xs text-gray-600 grid grid-cols-2 gap-2 max-w-xs">
                {collection
                    .filter((asset) => asset.name && asset.floorprice > 0)
                    .sort((a, b) => b.floorprice - a.floorprice)
                    .map((asset) => (
                        <React.Fragment key={asset.address}>
                            <span className="truncate">{asset.name}</span>
                            <div className="flex">
                                <span>{asset.floorprice}</span>
                                <span>{asset.currency}</span>
                                <span className="ml-1">(x{asset.balance})</span>
                            </div>
                        </React.Fragment>
                    ))}
            </div>
        </div>
    );
};

const TwitterTab: React.FC<{ screen_name: string }> = ({ screen_name }) => {
    const profile = useQuery(["twitter", { screen_name }], () =>
        fetch(`/api/members/twitter/${screen_name}`).then((r) => r.json())
    );

    if (profile.isLoading) {
        return <p>loading…</p>;
    }
    if (!profile.data) {
        return <p>Not found.</p>;
    }
    return (
        <div className="px-2 flex flex-col">
            <div className="flex space-x-4">
                <div>
                    <img
                        src={profile.data?.profile_image_url}
                        className="w-12 h-12 rounded-full"
                    />
                </div>
                <div className="flex-1 flex flex-col text-sm">
                    <span className="">{profile.data?.name}</span>
                    <small className="text-gray-400 text-xs">
                        @{profile.data?.screen_name}
                    </small>
                </div>
                {profile.data && (
                    <div>
                        <a
                            href={`https://twitter.com/${screen_name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-fit ml-auto"
                        >
                            <div className="w-fit text-xs py-1 px-3 rounded-xl border">
                                see on Twitter
                            </div>
                        </a>
                    </div>
                )}
            </div>
            <div className="pt-2">
                <p className="text-sm mb-2">{profile.data?.description}</p>
                <div className="text-xs flex space-x-4">
                    <span className="text-sm">
                        {kFormatter(profile.data?.friends_count)}
                        <small className="text-gray-400 ml-1">Following</small>
                    </span>
                    <span className="text-sm">
                        {kFormatter(profile.data?.followers_count)}
                        <small className="text-gray-400 ml-1">Followers</small>
                    </span>
                </div>
            </div>
        </div>
    );
};

const MemberItem: React.FC<
    { tag: string; contracts: string[] } & typeof fullMember
> = ({ tag, ...member }) => {
    const ownedTokens = member.collection.filter(
        (token) => token.address in contracts
    );
    const holder = ownedTokens.length > 0;
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<
        "collection" | "activity" | "twitter"
    >("collection");

    return (
        <div className="bg-white border rounded-xl flex flex-col px-6 max-w-2xl">
            <div className="border-b pt-2 pb-2">
                <div className="flex items-center space-x-2 text-xs pb-2">
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:underline"
                        href={`https://${
                            member.platform === "ETH"
                                ? "etherscan.io"
                                : "polygonscan.com"
                        }/address/${member.address}`}
                    >
                        # {member.address}
                    </a>
                    <div className="flex-1 flex space-x-2">
                        <div className="py-0.5 px-2 border border-blue-200 rounded-lg bg-blue-50 text-blue-800">
                            <span>{tag}</span>
                        </div>
                    </div>
                    {holder && (
                        <div className="text-yellow-600 flex items-center float-right">
                            <Icon.Award size={14} />
                            <span>Holder</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-6 text-gray-800">
                    <div className="flex items-center space-x-2">
                        <Icon.CreditCard size={14} />
                        <span className="text-sm text-black">
                            {kFormatter(member.balance.usd, 2)}
                            <small className="text-gray-400 text-xs ml-0.5">
                                USD
                            </small>
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Icon.DollarSign size={14} />
                        <span className="text-sm text-black">
                            {kFormatter(member.netWorth.usd, 2)}
                            <small className="text-gray-400 text-xs ml-0.5">
                                USD
                            </small>
                        </span>
                    </div>
                    {member.twitter && (
                        <div className="flex items-center space-x-2">
                            <Icon.Twitter size={14} />
                            <span className="text-sm text-black">
                                {kFormatter(member.twitter.followers)}{" "}
                                <small className="text-xs text-gray-400">
                                    Followers
                                </small>
                            </span>
                        </div>
                    )}
                    {member.twitter && (
                        <div className="flex items-center space-x-2">
                            <Icon.MapPin size={14} />
                            <span className="text-xs">
                                {member.twitter.location.split(",")[1].trim()}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="pt-2">
                <div className="flex items-center space-x-8 text-gray-600">
                    <div className="flex-1 text-black flex items-center space-x-2">
                        <Icon.ShoppingCart size={14} />
                        <span className="text-sm">
                            <small className="text-xs text-gray-400 mr-1">
                                Own
                            </small>
                            {ownedTokens.length}
                            <small className="text-xs text-gray-400 ml-1">
                                NFTs
                            </small>
                        </span>
                        {/* <div className="border-r h-5" /> */}
                        {/* <span className="text-sm">
                            <small className="text-xs text-gray-400 mr-1">
                                Avg. basket
                            </small>
                            1.12
                            <small className="text-xs text-gray-400 ml-1">
                                ETH
                            </small>
                        </span> */}
                    </div>
                    <div className="text-gray-400 flex items-center space-x-2">
                        <Icon.Clock size={14} />
                        <span className="font-light text-xs">
                            updated {new Date(member.updatedAt).toDateString()}
                        </span>
                    </div>
                </div>
                <div>
                    {isOpen && (
                        <div className="pt-4">
                            <nav className="flex space-x-2 border-b w-full">
                                <button
                                    onClick={() => setActiveTab("collection")}
                                    className={classNames(
                                        "text-xs text-gray-600 pb-2 px-2 border-b",
                                        activeTab === "collection"
                                            ? "border-black"
                                            : "border-white"
                                    )}
                                >
                                    Collection
                                </button>
                                <button
                                    onClick={() => setActiveTab("activity")}
                                    className={classNames(
                                        "text-xs text-gray-600 pb-2 px-2 border-b",
                                        activeTab === "activity"
                                            ? "border-black"
                                            : "border-white"
                                    )}
                                >
                                    Activity
                                </button>
                                {member.twitter && (
                                    <button
                                        onClick={() => setActiveTab("twitter")}
                                        className={classNames(
                                            "text-xs text-gray-600 pb-2 px-2 border-b",
                                            activeTab === "twitter"
                                                ? "border-black"
                                                : "border-white"
                                        )}
                                    >
                                        Twitter
                                    </button>
                                )}
                            </nav>
                            <div className="pt-2">
                                {activeTab === "collection" ? (
                                    <CollectionTab
                                        collection={member.collection}
                                    />
                                ) : activeTab ===
                                  "activity" ? null : activeTab ===
                                  "twitter" ? (
                                    <TwitterTab
                                        screen_name={member.twitter.screen_name}
                                    />
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full opacity-0 hover:opacity-60 py-2 flex items-center justify-center text-gray-400 transition-opacity"
                >
                    {isOpen ? (
                        <Icon.ChevronUp size={18} />
                    ) : (
                        <Icon.ChevronDown size={18} />
                    )}
                </button>
            </div>
        </div>
    );
};

const SkeletonItem: React.FC = () => (
    <div className="bg-white border rounded-xl flex flex-col px-6 max-w-2xl">
        <div className="border-b py-3">
            <div className="flex items-center space-x-2 text-xs pb-2">
                <Skeleton className="h-3 w-52" />
                <Skeleton className="h-3 w-16" />
            </div>
            <div className="pt-1 flex items-center space-x-6 text-gray-800">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
        <div className="pt-2 pb-6">
            <div className="flex items-center space-x-8 text-gray-600">
                <div className="flex-1 text-black flex items-center space-x-2">
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="text-gray-400 flex items-center space-x-2">
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </div>
    </div>
);

const contracts = [
    "0x5a9EB86269741A653C384D4810DBF093C86C44B8".toLowerCase(),
    "0x07314007735FAF41fA8ed4F590e5165BD21604B1".toLowerCase(),
];

const TestPage: NextPage = () => {
    return (
        <main className="min-h-screen bg-gray-100 p-4">
            <div className="flex flex-col space-y-4">
                <SkeletonItem />
                <MemberItem
                    contracts={contracts}
                    tag="Influencer"
                    {...fullMember}
                />
                <MemberItem contracts={contracts} tag="Whale" {...unkMember} />
            </div>
        </main>
    );
};

export default TestPage;
