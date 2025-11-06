import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://pocketbase.jiangxicheng.xyz/');

export const apis = {
    users: pb.collection('users'),
    habit_base: pb.collection('habit_base'),
    habit_tag_base: pb.collection('habit_tag_base'),
    habit_tag_link: pb.collection('habit_tag_link'),
    habit_clock: pb.collection('habit_clock'),

    habit_view_clock_number: pb.collection('habit_view_clock_number'),
    habit_view_tag_clock_number: pb.collection('habit_view_tag_clock_number'),

    login: async (email : string, pwd: string) => await pb.collection('users').authWithPassword(email, pwd),
}

