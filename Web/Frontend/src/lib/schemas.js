import { z } from 'zod';

const passwordSchema = z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre');

const phoneSchema = z.string().regex(/^\+?[0-9]{10,15}$/, 'Numéro de téléphone invalide');

// ---- Donneur Schema ----
export const donneurSchema = z.object({
    nom: z.string().min(2, 'Nom requis'),
    prenom: z.string().min(2, 'Prénom requis'),
    date_naissance: z.string().refine((date) => new Date(date) < new Date(), 'Date invalide'),
    sexe: z.enum(['M', 'F'], { errorMap: () => ({ message: 'Sexe requis' }) }),
    groupe_sanguin: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional().or(z.literal('')),
    telephone: phoneSchema,
    email: z.string().email('Email invalide'),
    ville: z.string().min(2, 'Ville requise'),
    password: passwordSchema,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

// ---- Hopital Schema ----
export const hopitalSchema = z.object({
    nom_officiel: z.string().min(2, 'Nom officiel requis'),
    code_etablissement: z.string().min(1, 'Code établissement requis'),
    type_etablissement: z.enum(['public', 'prive']),
    ice: z.string().optional(), // Required if prive, handled in superRefine or conditional UI
    ville: z.string().min(2, 'Ville requise'),
    adresse: z.string().min(5, 'Adresse requise'),
    email: z.string().email('Email professionnel requis'),
    telephone: phoneSchema,
    responsable_nom: z.string().min(2, 'Nom du responsable requis'),
    responsable_fonction: z.string().min(2, 'Fonction du responsable requise'),
    document_justificatif: z.any()
        .refine((files) => files?.length === 1, "Un document justificatif est requis")
        .refine((files) => files?.[0]?.size <= 5000000, "Le fichier ne doit pas dépasser 5MB")
        .optional(), // Made optional for now to avoid crashes on strict file validation without proper file input handling
    password: passwordSchema,
    confirmPassword: z.string()
}).superRefine((data, ctx) => {
    if (data.type_etablissement === 'prive' && !data.ice) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "L'ICE est requis pour les établissements privés",
            path: ["ice"]
        });
    }
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Les mots de passe ne correspondent pas",
            path: ["confirmPassword"]
        });
    }
});

// ---- Receveur Schema ----
export const receveurSchema = z.object({
    nom_patient: z.string().min(2, 'Nom du patient requis'),
    age: z.number({ invalid_type_error: 'Âge invalide' }).min(0).max(120),
    groupe_sanguin_requis: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], { errorMap: () => ({ message: 'Groupe sanguin requis' }) }),
    quantite: z.number({ invalid_type_error: 'Quantité requise' }).min(1),
    urgence: z.enum(['critique', 'eleve', 'normal'], { errorMap: () => ({ message: 'Niveau d\'urgence requis' }) }),
    hopital_clinique: z.string().min(2, 'Hôpital / Clinique requis'),
    ville: z.string().min(2, 'Ville requise'),
    service: z.string().min(2, 'Service requis'),
    contact_nom: z.string().min(2, 'Nom du contact requis'),
    contact_telephone: phoneSchema,
    contact_email: z.string().email('Email du contact invalide'),
    justificatif: z.any().optional(), // Similar handling to Hopital
});

export const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
    role: z.enum(['hopital', 'donneur', 'receveur'])
});
