import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useQuery } from '@apollo/client';
import { GET_BLOGPOSTS } from '../graphql/queries';
import { useMutation } from '@apollo/client';
import {
  ADD_BLOGPOST,
  DELETE_BLOGPOST,
  EDIT_BLOGPOST,
} from '../graphql/queries';
import { BlogPosts } from '../components/BlogPosts';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

const Home: NextPage = () => {
  const [addTodo, setAddTodo] = useState('');
  const [addBlogPost, { data, loading, error }] = useMutation(ADD_BLOGPOST, {
    onCompleted: (data) => {
      window.location.reload();
    },
  });

  // const onSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   addBlogPost({ variables: { text: addTodo } });
  // };

  const [deleteBlogPost] = useMutation(DELETE_BLOGPOST, {
    onCompleted: (data) => {
      window.location.reload();
    },
  });

  const onDelete = (id: String) => deleteBlogPost({ variables: { id } });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/upload-image?file=${filename}`);
    const data = await res.json();
    const formData = new FormData();
    console.log('Hello');

    // @ts-ignore
    Object.entries({ ...data.fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    toast.promise(
      fetch(data.url, {
        method: 'POST',
        body: formData,
      }),
      {
        loading: 'Uploading...',
        success: 'Image successfully uploaded!🎉',
        error: `Upload failed 😥 Please try again ${error}`,
      }
    );
  };

  const onSubmit = async (data: any) => {
    console.log('trying to submit 0');
    const { text, image } = data;
    const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${image[0].name}`;
    const variables = { text, imageUrl };
    console.log(imageUrl);
    try {
      console.log('trying to submit 1');
      toast.promise(addBlogPost({ variables }), {
        loading: 'Creating new link..',
        success: 'Link successfully created!🎉',
        error: `Something went wrong 😥 Please try again -  ${error}`,
      });
      console.log('trying to submit 2');
    } catch (error) {
      console.log('trying to submit 3');
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <Toaster />
      <BlogPosts onDelete={onDelete} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="text"
          {...register('text', { required: true })}
          name="text"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <input
          {...register('image', { required: true })}
          onChange={uploadPhoto}
          type="file"
          accept="image/png, image/jpeg"
          name="image"
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Home;
