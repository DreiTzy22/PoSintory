<?php

namespace App\Http\Controllers;

use App\Models\SaleItem;
use App\Http\Requests\StoreSaleItemRequest;
use App\Http\Requests\UpdateSaleItemRequest;

class SaleItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return SaleItem::query()
            ->with('product')
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
    public function store(StoreSaleItemRequest $request)
    {
        $item = SaleItem::create($request->validated());

        return response()->json($item->load('product'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SaleItem $saleItem)
    {
        return $saleItem->load('product');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SaleItem $saleItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSaleItemRequest $request, SaleItem $saleItem)
    {
        $saleItem->update($request->validated());

        return $saleItem->fresh()->load('product');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SaleItem $saleItem)
    {
        $saleItem->delete();

        return response()->noContent();
    }
}
