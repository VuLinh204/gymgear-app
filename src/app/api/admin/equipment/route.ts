import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htwsrvixpvauhhngxzso.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function getAdminClient() {
  const sb = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    await sb.auth.signInWithPassword({
      email: 'khanh@gymgear.vn',
      password: 'password123'
    });
  } catch (authErr) {
    console.warn('Lỗi xác thực admin:', authErr);
  }

  return sb;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// POST: Tạo máy tập gym mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      brand,
      category = 'strength',
      type = 'commercial',
      modelNumber = '',
      priceRange = '',
      vipPrice = '',
      estimatedPrice = 0,
      thumbnail = '',
      gallery = [],
      excerpt = '',
      fullDescription = '',
      specifications = {},
      pros = [],
      cons = [],
      isFeatured = false,
      availableForBooking = true,
      showroomLocations = ['Showroom Hà Nội', 'Showroom TP.HCM']
    } = body;

    if (!name || !brand) {
      return NextResponse.json(
        { success: false, error: 'Tên máy và Thương hiệu là bắt buộc.' },
        { status: 400 }
      );
    }

    const sb = await getAdminClient();
    const generatedId = `eq-${Date.now()}`;
    const generatedSlug = slugify(name) || generatedId;

    const newRecord = {
      id: body.id || generatedId,
      name,
      slug: body.slug || generatedSlug,
      brand,
      category,
      type,
      model_number: modelNumber,
      price_range: priceRange,
      vip_price: vipPrice,
      estimated_price: Number(estimatedPrice) || 0,
      rating: body.rating || 5.0,
      review_count: body.reviewCount || 0,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
      gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : [thumbnail].filter(Boolean),
      excerpt: excerpt || name,
      full_description: fullDescription || excerpt || name,
      specifications: typeof specifications === 'object' ? specifications : {
        weightCapacity: '200 kg',
        dimensions: '2000 x 1000 x 1500 mm',
        machineWeight: '150 kg',
        warranty: '5 năm'
      },
      pros: Array.isArray(pros) ? pros : [],
      cons: Array.isArray(cons) ? cons : [],
      is_featured: Boolean(isFeatured),
      available_for_booking: availableForBooking ?? true,
      showroom_locations: Array.isArray(showroomLocations) ? showroomLocations : ['Showroom Hà Nội', 'Showroom TP.HCM']
    };

    const { data, error } = await sb
      .from('equipments')
      .insert(newRecord)
      .select()
      .single();

    if (error) {
      console.error('Lỗi khi thêm thiết bị vào Supabase:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Exception tại POST /api/admin/equipment:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi server' }, { status: 500 });
  }
}

// PUT: Cập nhật thông tin máy tập gym
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID thiết bị cần cập nhật.' }, { status: 400 });
    }

    const sb = await getAdminClient();

    const updatePayload: Record<string, any> = {};
    if (body.name !== undefined) {
      updatePayload.name = body.name;
      if (!body.slug) updatePayload.slug = slugify(body.name);
    }
    if (body.slug !== undefined) updatePayload.slug = body.slug;
    if (body.brand !== undefined) updatePayload.brand = body.brand;
    if (body.category !== undefined) updatePayload.category = body.category;
    if (body.type !== undefined) updatePayload.type = body.type;
    if (body.modelNumber !== undefined) updatePayload.model_number = body.modelNumber;
    if (body.priceRange !== undefined) updatePayload.price_range = body.priceRange;
    if (body.vipPrice !== undefined) updatePayload.vip_price = body.vipPrice;
    if (body.estimatedPrice !== undefined) updatePayload.estimated_price = Number(body.estimatedPrice) || 0;
    if (body.rating !== undefined) updatePayload.rating = Number(body.rating) || 5.0;
    if (body.reviewCount !== undefined) updatePayload.review_count = Number(body.reviewCount) || 0;
    if (body.thumbnail !== undefined) updatePayload.thumbnail = body.thumbnail;
    if (body.gallery !== undefined) updatePayload.gallery = body.gallery;
    if (body.excerpt !== undefined) updatePayload.excerpt = body.excerpt;
    if (body.fullDescription !== undefined) updatePayload.full_description = body.fullDescription;
    if (body.specifications !== undefined) updatePayload.specifications = body.specifications;
    if (body.pros !== undefined) updatePayload.pros = body.pros;
    if (body.cons !== undefined) updatePayload.cons = body.cons;
    if (body.isFeatured !== undefined) updatePayload.is_featured = Boolean(body.isFeatured);
    if (body.availableForBooking !== undefined) updatePayload.available_for_booking = Boolean(body.availableForBooking);
    if (body.showroomLocations !== undefined) updatePayload.showroom_locations = body.showroomLocations;

    const { data, error } = await sb
      .from('equipments')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Lỗi khi cập nhật thiết bị:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Exception tại PUT /api/admin/equipment:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi server' }, { status: 500 });
  }
}

// DELETE: Xóa máy tập gym
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch (_) {}
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID thiết bị cần xóa.' }, { status: 400 });
    }

    const sb = await getAdminClient();
    const { error } = await sb
      .from('equipments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Lỗi khi xóa thiết bị khỏi DB:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Đã xóa thiết bị ${id} thành công.` });
  } catch (err: any) {
    console.error('Exception tại DELETE /api/admin/equipment:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi server' }, { status: 500 });
  }
}
