"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase-client";



const CATEGORIES = ["Home", "Electronics", "Fitness", "Beauty", "Kitchen"];

type Product = {
	id: number;
	name: string;
	search_keyword: string;
	wiki_title: string;
	image_query: string;
	category: string;
	competition: string;
	social_growth: number;
	sales_signal: number;
	ad_growth: number;
	creator_growth: number;
	competition_penalty: number;
	trend_status?: string | null;
};

export default function AdminPage() {
	const [authenticated, setAuthenticated] = useState(false);
	const [passwordInput, setPasswordInput] = useState("");
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [form, setForm] = useState({
		name: "", search_keyword: "", wiki_title: "", image_query: "",
		category: "Home", competition: "MEDIUM", social_growth: 50, sales_signal: 50,
		ad_growth: 50, creator_growth: 50, competition_penalty: 10,
	});

	async function loadProducts() {
		const supabase = createClient();
		const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
		setProducts(data || []);
	}

	useEffect(() => { if (authenticated) loadProducts(); }, [authenticated]);

	async function handlePasswordSubmit(e: React.FormEvent) {
                e.preventDefault();
                const res = await fetch("/api/admin/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ password: passwordInput }),
                });
                if (res.ok) setAuthenticated(true);
                else setMessage("Wrong password");
        }

	async function handleAddProduct(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true); setMessage("");
		// Writes go through a server route using the Supabase service role key,
		// not the browser client - "products" now has Row Level Security
		// enabled with a public read-only policy, so a direct insert from the
		// browser's anon-key client would be rejected.
		const res = await fetch("/api/admin/products", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password: passwordInput, product: form }),
		});
		const data = await res.json();
		if (!res.ok) setMessage("Error: " + (data.error || "Failed to add product"));
		else {
			setMessage("Product added successfully!");
			setForm({ name: "", search_keyword: "", wiki_title: "", image_query: "", category: "Home", competition: "MEDIUM", social_growth: 50, sales_signal: 50, ad_growth: 50, creator_growth: 50, competition_penalty: 10 });
			loadProducts();
		}
		setLoading(false);
	}

	async function handleDelete(id: number) {
		if (!confirm("Delete this product?")) return;
		await fetch("/api/admin/products", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password: passwordInput, id }),
		});
		loadProducts();
	}

	if (!authenticated) return (
		<main className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-6">
			<form onSubmit={handlePasswordSubmit} className="w-full max-w-sm rounded-lg border border-[#E4E7EC] bg-white p-8">
				<h1 className="mb-4 text-xl font-semibold text-[#0F172A]">Admin Access</h1>
				<input type="password" placeholder="Password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="mb-3 w-full rounded-md border border-[#E4E7EC] px-3 py-2 text-sm" />
				{message && <p className="mb-3 text-sm text-[#DC2626]">{message}</p>}
				<button type="submit" className="w-full rounded-md bg-[#0F172A] py-2 text-sm font-medium text-white">Enter</button>
			</form>
		</main>
	);

	const update = (field: string, value: string | number) => setForm({ ...form, [field]: value });
	return (
		<main className="min-h-screen bg-[#F7F8FA] px-6 py-10"><div className="mx-auto max-w-4xl">
			<h1 className="mb-6 text-2xl font-semibold text-[#0F172A]">Product Admin</h1>
			<div className="mb-8 rounded-lg border border-[#E4E7EC] bg-white p-6"><h2 className="mb-4 text-lg font-semibold text-[#0F172A]">Add New Product</h2>
				<form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-3">
					{([['name','Product name'],['search_keyword','Search keyword'],['wiki_title','Wikipedia page title'],['image_query','Image search term']] as const).map(([field, placeholder]) => <input key={field} placeholder={placeholder} required value={form[field]} onChange={(e) => update(field, e.target.value)} className="rounded-md border border-[#E4E7EC] px-3 py-2 text-sm" />)}
					<select value={form.category} onChange={(e) => update('category', e.target.value)} className="rounded-md border border-[#E4E7EC] px-3 py-2 text-sm">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
					<select value={form.competition} onChange={(e) => update('competition', e.target.value)} className="rounded-md border border-[#E4E7EC] px-3 py-2 text-sm"><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select>
					{([['social_growth','Social Growth'],['sales_signal','Sales Signal'],['ad_growth','Ad Growth'],['creator_growth','Creator Growth'],['competition_penalty','Competition Penalty']] as const).map(([field, label]) => <label key={field} className="text-xs text-[#64748B]">{label}<input type="number" value={form[field]} onChange={(e) => update(field, Number(e.target.value))} className="mt-1 w-full rounded-md border border-[#E4E7EC] px-3 py-2 text-sm" /></label>)}
					<button type="submit" disabled={loading} className="col-span-2 mt-2 rounded-md bg-[#0F172A] py-2 text-sm font-medium text-white disabled:opacity-50">{loading ? "Adding..." : "Add Product"}</button>
				</form>{message && <p className="mt-3 text-sm text-[#16A34A]">{message}</p>}
			</div>
			<div className="rounded-lg border border-[#E4E7EC] bg-white p-6"><h2 className="mb-4 text-lg font-semibold text-[#0F172A]">Current Products ({products.length})</h2><div className="space-y-2">{products.map((p) => <div key={p.id} className="flex items-center justify-between rounded-md border border-[#E4E7EC] px-3 py-2 text-sm"><span className="flex items-center gap-2">{p.name}{p.category && <span className="rounded-full bg-[#F7F8FA] px-2 py-0.5 text-[10px] font-medium text-[#64748B]">{p.category}</span>}{p.trend_status === "declining" && <span className="rounded-full bg-[#DC2626]/10 px-2 py-0.5 text-[10px] font-medium text-[#DC2626]">⚠️ Declining - consider replacing</span>}</span><button onClick={() => handleDelete(p.id)} className="text-xs text-[#DC2626]">Delete</button></div>)}</div></div>
		</div></main>
	);
}