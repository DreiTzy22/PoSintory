<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Http\Requests\StoreSaleRequest;
use App\Http\Requests\UpdateSaleRequest;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Sale::query()
            ->with(['items.product', 'customer'])
            ->latest('id')
            ->paginate(25);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSaleRequest $request)
    {
        return \Illuminate\Support\Facades\DB::transaction(function () use ($request) {
            $validated = $request->validated();
            $items = $validated['items'];
            unset($validated['items']);

            $sale = Sale::create([
                ...$validated,
                'user_id' => $request->user()->id,
                'status' => $validated['status'] ?? 'completed',
            ]);

            foreach ($items as $item) {
                $sale->items()->create($item);

                // Update product stock
                $product = \App\Models\Product::find($item['product_id']);
                if ($product) {
                    $product->decrement('stock', $item['quantity']);
                }
            }

            return response()->json($sale->load('items.product'), 201);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        return $sale->load('items.product');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSaleRequest $request, Sale $sale)
    {
        $sale->update($request->validated());

        return $sale->fresh()->load('items.product');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        $sale->delete();

        return response()->noContent();
    }
}
