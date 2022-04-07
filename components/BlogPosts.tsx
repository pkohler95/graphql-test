import { useQuery } from '@apollo/client';
import { GET_BLOGPOSTS } from '../graphql/queries';

interface BlogPost {
  id: String;
  text: String;
  imageUrl: String;
  onDelete: (id: String) => void;
}

const BlogPost = ({ text, id, imageUrl, onDelete }: BlogPost) => {
  return (
    <div>
      <p>{text}</p>
      <p>{imageUrl}</p>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
};

interface Props {
  onDelete: (id: String) => void;
}

interface BlogPostData {
  id: String;
  text: String;
}

export const BlogPosts = ({ onDelete }: Props) => {
  const { loading, error, data } = useQuery(GET_BLOGPOSTS);
  if (loading) {
    return 'loading';
  }
  if (error) {
    return 'error';
  }

  return data.blogPosts.map((blogPostData: BlogPostData) => (
    <BlogPost onDelete={onDelete} {...blogPostData} key={blogPostData.id} />
  ));
};
