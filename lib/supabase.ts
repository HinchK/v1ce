import {createClient} from "@supabase/supabase-js";
const SUPABASE_URL="https://gvvnixltrfyhsmakdqgm.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_cxaVNv_FUG-bmaP8oE5tDQ_DVkoyl8Y";
export const supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
export type SobrietyProfile={id?:string;user_id?:string;email:string;display_name:string;sobriety_date:string;substances:string[];coin_color:string;coin_shape:string;number_style:string;coin_show_border:boolean;coin_border_color:string;coin_number_color:string;coin_photo:string;coin_image_only:boolean;coin_motto:string;avatar_url:string;gifted_count:number;is_premium:boolean;coin_balance:number;created_at?:string};