// 'use client';

// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { useMutationState } from '@/hooks/useMutationState';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { api } from '@/convex/_generated/api';
// import { CirclePlus, X } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { ConvexError } from 'convex/values';
// import { useForm } from 'react-hook-form';
// import { useQuery } from 'convex/react';
// import { useMemo } from 'react';
// import { toast } from 'sonner';
// import { z } from 'zod';

// const createChatFormSchema = z.object({
//     name: z.string().min(1, { message: "This field can't be empty" }),
//     members: z.string().array().min(1, { message: 'You must select at least 1 friend' }),
// });

// export default function CreateChatDialog() {
//     const friends = useQuery(api.friends.get);

//     const { mutate: createGroup, pending } = useMutationState(api.conversation.createGroup);

//     const form = useForm<z.infer<typeof createChatFormSchema>>({
//         resolver: zodResolver(createChatFormSchema),
//         defaultValues: {
//             name: '',
//             members: [],
//         },
//     });

//     const members = form.watch('chatMembers', []);

//     const unselectedFriends = useMemo(() => {
//         return friends ? friends.filter((friend) => !members.includes(friend._id)) : [];
//     }, [members.length, friends?.length]);

//     async function handleSubmit(values: z.infer<typeof createChatFormSchema>) {
//         await createGroup({ name: values.name, members: values.members })
//             .then(() => {
//                 form.reset();
//                 toast.success('Group created!');
//             })
//             .catch((error) => {
//                 toast.error(error instanceof ConvexError ? error.data : 'Unexpected error occurred');
//             });
//     }

//     return (
//         <Dialog>
//             <Tooltip>
//                 <TooltipTrigger>
//                     <Button size="icon" variant="outline">
//                         <DialogTrigger asChild>
//                             <CirclePlus />
//                         </DialogTrigger>
//                     </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                     <p>Create Group</p>
//                 </TooltipContent>
//             </Tooltip>

//             <DialogContent className="block">
//                 <DialogHeader>
//                     <DialogTitle>Create group</DialogTitle>
//                     <DialogDescription>Add your friends to get started!</DialogDescription>
//                 </DialogHeader>
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
//                         <FormField
//                             control={form.control}
//                             name="name"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Name</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="Group name..." {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="members"
//                             render={() => (
//                                 <FormItem>
//                                     <FormLabel>Friends</FormLabel>
//                                     <FormControl>
//                                         <DropdownMenu>
//                                             <DropdownMenuTrigger asChild disabled={unselectedFriends.length === 0}>
//                                                 <Button className="w-full" variant="outline">
//                                                     Select
//                                                 </Button>
//                                             </DropdownMenuTrigger>
//                                             <DropdownMenuContent className="w-full">
//                                                 {unselectedFriends?.map((friend) => {
//                                                     return (
//                                                         <DropdownMenuCheckboxItem
//                                                             key={friend._id}
//                                                             className="flex items-center gap-2 w-full p-2"
//                                                             onCheckedChange={(checked) => {
//                                                                 if (checked) {
//                                                                     form.setValue('members', [...members, friend._id]);
//                                                                 }
//                                                             }}
//                                                         >
//                                                             <Avatar className="w-8 h-8">
//                                                                 <AvatarImage src={friend.imageUrl} />
//                                                                 <AvatarFallback>{friend.username.substring(0, 1)}</AvatarFallback>
//                                                             </Avatar>
//                                                             <h4 className="truncate">{friend.username}</h4>
//                                                         </DropdownMenuCheckboxItem>
//                                                     );
//                                                 })}
//                                             </DropdownMenuContent>
//                                         </DropdownMenu>
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         {members && members.length ? (
//                             <Card className="flex items-center gap-3 overflow-x-auto w-full h-24 p-2 no-scrollbar">
//                                 {friends
//                                     ?.filter((friend) => members.includes(friend._id))
//                                     .map((friend) => {
//                                         return (
//                                             <div key={friend._id} className="flex flex-col items-center gap-1">
//                                                 <div className="relative">
//                                                     <Avatar>
//                                                         <AvatarImage src={friend.imageUrl} />
//                                                         <AvatarFallback>{friend.username.substring(0, 1)}</AvatarFallback>
//                                                     </Avatar>
//                                                     <X
//                                                         className="text-muted-foreground w-4 h-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointer"
//                                                         onClick={() =>
//                                                             form.setValue(
//                                                                 'members',
//                                                                 members.filter((id) => id !== friend._id)
//                                                             )
//                                                         }
//                                                     />
//                                                 </div>
//                                                 <p className="truncate text-sm">{friend?.username?.split(' ')[0]}</p>
//                                             </div>
//                                         );
//                                     })}
//                             </Card>
//                         ) : null}
//                         <DialogFooter>
//                             <Button disabled={pending} type="submit">
//                                 Create
//                             </Button>
//                         </DialogFooter>
//                     </form>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     );
// }
