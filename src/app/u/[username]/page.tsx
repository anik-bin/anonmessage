"use client"
import React, { useState } from 'react'
import { useParams } from 'next/navigation';
import { useCompletion } from 'ai/react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import * as z from "zod";
import { MessageSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { INITIAL_MESSAGE_STRING } from "@/lib/constants"
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const specialChar = '|';

const parseStringMessages = (messageString: string): string[] => {
  return messageString
    .split(specialChar)
    .map((message) => message.trim().replace(/^'|'$/g, '').replace(/^"|"$/g, ''));
};


const SendMessage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: INITIAL_MESSAGE_STRING
  });

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message)
  }

  const fetchSuggestedMessages = async () => {
    try {
      complete("")

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch suggested messages. Please try again.",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching suggested messages.",
        variant: "destructive",
      });
    }
  }

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      })

      toast({
        title: response.data.message,
        variant: "default"
      })

      form.reset({ ...form.getValues(), content: "" })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to sent a message",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send anonymous message to @{username}</FormLabel>
                <FormControl>
                  <Textarea placeholder='Write your anonymous message here'
                    className='resize-none'
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-center'>
            {isLoading ?
              (
                <Button disabled>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Please wait
                </Button>
              ) :
              (
                <Button type='submit' disabled={isLoading || !messageContent}>
                  Send it
                </Button>
              )}
          </div>
        </form>
      </Form>

      <div className='space-y-4 my-8'>
        <div className='space-y-2 text-center sm:text-left'>
          <Button
            onClick={fetchSuggestedMessages}
            className='my-4 mx-auto sm:mx-0'
            disabled={isSuggestLoading}>
            Suggest Messages
          </Button>
          <p>Click on any message to select it.</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 whitespace-normal break-words text-left p-4"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  )
}

export default SendMessage