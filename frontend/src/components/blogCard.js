import React from 'react';
import { Link } from 'react-router-dom';
import { BLOGDETAILROUTE } from '../api';

const BlogPostCard = ({ post }) => {
    const { title, content, created_at, image } = post;

    return (
        <Link to={`${BLOGDETAILROUTE}/${post.id}`}>
            <div className="max-w-md bg-white rounded overflow-hidden shadow-sm hover:shadow-lg">
                <div
                    className="w-full h-64 bg-cover bg-center bg-no-repeat" 
                    style={{ backgroundImage: `url(${image})`}}
                ></div>
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{title}</div>
                    <p className="text-gray-700 text-base">{content}</p>
                </div>
                <div className="px-6 py-4">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                        Created at: {new Date(created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default BlogPostCard;
