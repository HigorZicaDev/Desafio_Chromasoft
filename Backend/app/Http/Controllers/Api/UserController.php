<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        
        $users = UserResource::collection(User::all());

        return response()->json([
            'status' => true,
            'users' => $users
        ], 200);
    }

    public function show(string $id): JsonResponse
    {

        $user = new UserResource(User::where('id', $id)->first());
        return response()->json([
            'status' => true,
            'user' => $user,
        ], 200);
    }

    public function delete(string $id): JsonResponse
    {
        // Procurar o usuário pelo ID
        $user = User::find($id);
    
        // Verificar se o usuário existe
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Usuário não encontrado.',
            ], 404);
        }
    
        // Excluir o usuário
        $user->delete();
    
        // Retornar a resposta de sucesso
        return response()->json([
            'status' => true,
            'message' => 'Usuário excluído com sucesso.',
        ], 200);
    }

    public function register(Request $request): JsonResponse
    {
        // Validação dos dados recebidos
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Criação do novo usuário
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'User registered successfully.',
                'user' => $user
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Registration failed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

     // Método para atualizar o usuário
     public function update(Request $request, string $id): JsonResponse
     {
         // Validação dos dados recebidos
         $validator = Validator::make($request->all(), [
             'name' => 'required|string|max:255',
             'email' => 'required|email|unique:users,email,' . $id, // Garantir que o email não seja único para o próprio usuário
             'password' => 'nullable|string|min:6|confirmed',  // Senha é opcional na atualização
         ]);
 
         if ($validator->fails()) {
             return response()->json([
                 'status' => false,
                 'errors' => $validator->errors()
             ], 422);
         }
 
         try {
             // Procurar o usuário pelo ID
             $user = User::findOrFail($id);
 
             // Atualizar os dados do usuário
             $user->name = $request->name;
             $user->email = $request->email;
 
             // Se a senha foi fornecida, atualizamos a senha
             if ($request->filled('password')) {
                 $user->password = Hash::make($request->password);
             }
 
             // Salvar as alterações
             $user->save();
 
             return response()->json([
                 'status' => true,
                 'message' => 'User updated successfully.',
                 'user' => new UserResource($user)
             ], 200);
 
         } catch (Exception $e) {
             return response()->json([
                 'status' => false,
                 'message' => 'Update failed.',
                 'error' => $e->getMessage()
             ], 500);
         }
     }


}
