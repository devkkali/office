<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenant;

class TenantController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'id' => 'required|string|unique:tenants,id',
        ]);

        try {
            $centralDomains = config('tenancy.central_domains');
            $mainDomain = $centralDomains[0] ?? 'localhost';

            $tenant = Tenant::create([
                'id' => $request->id,
                'domains' => [
                    [
                        'domain' => $request->input(
                            'domain',
                            $request->id . '.' . $mainDomain
                        )
                    ]
                ],
                // Optional: 'data' => [...]
            ]);

            return response()->json([
                'message' => 'Tenant created successfully',
                'tenant'  => $tenant,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Tenant creation failed',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
